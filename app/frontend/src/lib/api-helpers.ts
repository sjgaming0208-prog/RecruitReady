import { client } from './api';
import type { ProgressEntry, Branch } from './fitnessData';

// ---- Auth ----
export async function getCurrentUser() {
  try {
    const user = await client.auth.me();
    return user?.data ?? null;
  } catch {
    return null;
  }
}

export async function loginRedirect() {
  await client.auth.toLogin();
}

export async function logoutUser() {
  await client.auth.logout();
}

// ---- Progress Entries (Cloud) ----
export async function fetchCloudProgress(branch?: string): Promise<ProgressEntry[]> {
  try {
    const query = branch ? { branch } : {};
    const response = await client.entities.progress_entries.query({
      query,
      sort: '-date',
      limit: 200,
    });
    const items = response?.data?.items ?? [];
    return items.map((item: any) => ({
      id: String(item.id),
      date: item.date,
      branch: item.branch as Branch,
      exercises: typeof item.exercises === 'string' ? JSON.parse(item.exercises) : item.exercises,
    }));
  } catch (err) {
    console.error('Failed to fetch cloud progress:', err);
    return [];
  }
}

export async function createCloudProgress(entry: ProgressEntry): Promise<boolean> {
  try {
    await client.entities.progress_entries.create({
      data: {
        branch: entry.branch,
        date: entry.date,
        exercises: JSON.stringify(entry.exercises),
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to create cloud progress:', err);
    return false;
  }
}

export async function deleteCloudProgress(id: string): Promise<boolean> {
  try {
    await client.entities.progress_entries.delete({ id });
    return true;
  } catch (err) {
    console.error('Failed to delete cloud progress:', err);
    return false;
  }
}

// ---- User Preferences (Cloud) ----
export interface UserPrefs {
  id?: number;
  selected_branch?: string;
  subscription_tier?: string;
  subscription_status?: string;
}

export async function fetchUserPrefs(): Promise<UserPrefs | null> {
  try {
    const response = await client.entities.user_preferences.query({
      query: {},
      limit: 1,
    });
    const items = response?.data?.items ?? [];
    return items.length > 0 ? items[0] : null;
  } catch {
    return null;
  }
}

export async function saveUserPrefs(prefs: Partial<UserPrefs>): Promise<boolean> {
  try {
    const existing = await fetchUserPrefs();
    if (existing?.id) {
      await client.entities.user_preferences.update({
        id: String(existing.id),
        data: prefs,
      });
    } else {
      await client.entities.user_preferences.create({
        data: {
          selected_branch: prefs.selected_branch || 'army',
          subscription_tier: prefs.subscription_tier || 'recruit',
          subscription_status: prefs.subscription_status || 'active',
        },
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to save user prefs:', err);
    return false;
  }
}

// ---- Payments (Stripe) ----
export async function createPaymentSession(planId: string): Promise<{ session_id: string; url: string } | null> {
  try {
    const response = await client.apiCall.invoke({
      url: '/api/v1/payment/create_payment_session',
      method: 'POST',
      data: { plan_id: planId },
    });
    return response?.data ?? null;
  } catch (err) {
    console.error('Failed to create payment session:', err);
    return null;
  }
}

export async function verifyPayment(sessionId: string): Promise<{
  status: string;
  order_id: number | null;
  payment_status: string;
  plan_id: string | null;
} | null> {
  try {
    const response = await client.apiCall.invoke({
      url: '/api/v1/payment/verify_payment',
      method: 'POST',
      data: { session_id: sessionId },
    });
    return response?.data ?? null;
  } catch (err) {
    console.error('Failed to verify payment:', err);
    return null;
  }
}