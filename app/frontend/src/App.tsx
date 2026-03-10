import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { hasCompletedOnboarding } from './pages/Onboarding';
import Onboarding from './pages/Onboarding';
import Index from './pages/Index';
import Standards from './pages/Standards';
import Progress from './pages/Progress';
import Training from './pages/Training';
import Tips from './pages/Tips';
import BMI from './pages/BMI';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/PaymentSuccess';
import NotFound from './pages/NotFound';
import Account from './pages/Account';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';

const queryClient = new QueryClient();

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  if (!hasCompletedOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route path="/" element={<RequireOnboarding><Index /></RequireOnboarding>} />
          <Route path="/standards" element={<RequireOnboarding><Standards /></RequireOnboarding>} />
          <Route path="/progress" element={<RequireOnboarding><Progress /></RequireOnboarding>} />
          <Route path="/training" element={<RequireOnboarding><Training /></RequireOnboarding>} />
          <Route path="/tips" element={<RequireOnboarding><Tips /></RequireOnboarding>} />
          <Route path="/bmi" element={<RequireOnboarding><BMI /></RequireOnboarding>} />
          <Route path="/pricing" element={<RequireOnboarding><Pricing /></RequireOnboarding>} />
          <Route path="/payment-success" element={<RequireOnboarding><PaymentSuccess /></RequireOnboarding>} />
          <Route path="/account" element={<RequireOnboarding><Account /></RequireOnboarding>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;