import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  getOnboardingProfile,
  saveOnboardingProfile,
  type UserProfile,
} from "./Onboarding";
import { saveUserPrefs } from "@/lib/api-helpers";
import { branches, type Branch } from "@/lib/fitnessData";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  Target,
  Shield,
  Crown,
  Sword,
  Edit3,
  Save,
  XCircle,
  LogOut,
  CreditCard,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tierConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  recruit: {
    label: "Recruit",
    icon: <Shield className="w-5 h-5" />,
    color: "text-slate-300",
    bgColor: "bg-slate-500/10",
  },
  soldier: {
    label: "Soldier",
    icon: <Sword className="w-5 h-5" />,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  officer: {
    label: "Officer",
    icon: <Crown className="w-5 h-5" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading, subscriptionTier, prefs, login, logout, refresh } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState<"male" | "female">("male");
  const [editFitnessLevel, setEditFitnessLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [editTestDate, setEditTestDate] = useState("");
  const [editBranch, setEditBranch] = useState<Branch>("army");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const p = getOnboardingProfile();
    if (p) {
      setProfile(p);
      setEditName(p.name);
      setEditAge(p.age);
      setEditGender(p.gender);
      setEditFitnessLevel(p.fitnessLevel);
      setEditTestDate(p.testDate);
      setEditBranch(p.branch);
    }
  }, []);

  const handleSaveProfile = () => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      name: editName.trim() || "Recruit",
      age: editAge || "25",
      gender: editGender,
      fitnessLevel: editFitnessLevel,
      testDate: editTestDate,
      branch: editBranch,
    };
    saveOnboardingProfile(updated);
    setProfile(updated);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelMembership = async () => {
    setCancelling(true);
    try {
      const success = await saveUserPrefs({
        subscription_tier: "recruit",
        subscription_status: "cancelled",
      });
      if (success) {
        toast.success("Membership cancelled. You've been moved to the free Recruit plan.");
        await refresh();
        setCancelDialogOpen(false);
      } else {
        toast.error("Failed to cancel membership. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const currentTier = tierConfig[subscriptionTier] || tierConfig.recruit;
  const branchInfo = branches.find((b) => b.id === profile?.branch);
  const isPaidTier = subscriptionTier === "soldier" || subscriptionTier === "officer";

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            My Account
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your profile, subscription, and account settings.
          </p>
        </div>

        {/* Auth Status Card */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-400" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="h-12 bg-[#0F1419] rounded-lg animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.email || "Signed In"}
                    </p>
                    <p className="text-xs text-slate-500">Signed in • Data synced to cloud</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Not signed in</p>
                  <p className="text-xs text-slate-500">Sign in to sync your data across devices</p>
                </div>
                <Button
                  onClick={login}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", currentTier.bgColor)}>
                  <div className={currentTier.color}>{currentTier.icon}</div>
                </div>
                <div>
                  <p className={cn("text-lg font-bold", currentTier.color)}>
                    {currentTier.label} Plan
                  </p>
                  <p className="text-xs text-slate-500">
                    {isPaidTier
                      ? prefs?.subscription_status === "cancelled"
                        ? "Cancelled — access until billing period ends"
                        : "Active subscription"
                      : "Free plan — upgrade for more features"}
                  </p>
                </div>
              </div>
              {!isPaidTier && (
                <Badge className="bg-slate-500/10 text-slate-400 border-0 text-[10px]">
                  FREE
                </Badge>
              )}
            </div>

            <Separator className="bg-[#2D3B4E]" />

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/pricing")}
                variant="outline"
                size="sm"
                className="flex-1 border-[#2D3B4E] text-slate-300 hover:bg-[#2D3B4E] hover:text-white"
              >
                {isPaidTier ? "Change Plan" : "Upgrade"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              {isPaidTier && prefs?.subscription_status !== "cancelled" && (
                <Button
                  onClick={() => setCancelDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <User className="w-4 h-4 text-green-400" />
                Personal Information
              </CardTitle>
              {!editing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                >
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      if (profile) {
                        setEditName(profile.name);
                        setEditAge(profile.age);
                        setEditGender(profile.gender);
                        setEditFitnessLevel(profile.fitnessLevel);
                        setEditTestDate(profile.testDate);
                        setEditBranch(profile.branch);
                      }
                    }}
                    className="text-slate-400 hover:text-slate-200 hover:bg-[#2D3B4E]"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editing ? (
              /* View Mode */
              <>
                {/* Branch Banner */}
                {branchInfo && (
                  <div className="relative rounded-xl overflow-hidden h-28">
                    <img
                      src={branchInfo.image}
                      alt={branchInfo.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-4">
                      <Badge
                        className={cn(
                          "w-fit mb-1 text-[10px] border-0",
                          branchInfo.bgColor,
                          branchInfo.color
                        )}
                      >
                        {branchInfo.fullName}
                      </Badge>
                      <p className="font-bold text-white text-sm">{branchInfo.name}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <InfoItem icon={<User className="w-3.5 h-3.5" />} label="Name" value={profile?.name || "Recruit"} />
                  <InfoItem icon={<Calendar className="w-3.5 h-3.5" />} label="Age" value={profile?.age || "25"} />
                  <InfoItem label="Gender" value={profile?.gender === "female" ? "Female" : "Male"} />
                  <InfoItem
                    icon={<Target className="w-3.5 h-3.5" />}
                    label="Fitness Level"
                    value={profile?.fitnessLevel ? profile.fitnessLevel.charAt(0).toUpperCase() + profile.fitnessLevel.slice(1) : "Beginner"}
                  />
                  {profile?.testDate && (
                    <InfoItem
                      icon={<Calendar className="w-3.5 h-3.5" />}
                      label="Assessment Date"
                      value={new Date(profile.testDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    />
                  )}
                </div>
              </>
            ) : (
              /* Edit Mode */
              <div className="space-y-4">
                {/* Branch Selector */}
                <div>
                  <Label className="text-xs text-slate-400 mb-2 block">Service Branch</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => setEditBranch(branch.id)}
                        className={cn(
                          "relative rounded-xl overflow-hidden h-20 transition-all duration-200 group",
                          editBranch === branch.id
                            ? "ring-2 ring-green-500 ring-offset-1 ring-offset-[#1E2A3A]"
                            : "ring-1 ring-[#2D3B4E] hover:ring-[#3D4B5E]"
                        )}
                      >
                        <img
                          src={branch.image}
                          alt={branch.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative h-full flex items-center justify-center">
                          <p className="text-xs font-bold text-white">{branch.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Name
                  </Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>

                {/* Age */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Age
                  </Label>
                  <Input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    placeholder="e.g. 22"
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">Gender</Label>
                  <div className="flex gap-3">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setEditGender(g)}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border",
                          editGender === g
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-[#0F1419] text-slate-400 border-[#2D3B4E] hover:border-[#3D4B5E]"
                        )}
                      >
                        {g === "male" ? "Male" : "Female"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fitness Level */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Fitness Level
                  </Label>
                  <div className="flex gap-2">
                    {([
                      { id: "beginner" as const, label: "Beginner", emoji: "🌱" },
                      { id: "intermediate" as const, label: "Intermediate", emoji: "💪" },
                      { id: "advanced" as const, label: "Advanced", emoji: "🔥" },
                    ]).map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setEditFitnessLevel(level.id)}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-xs font-medium transition-all border",
                          editFitnessLevel === level.id
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-[#0F1419] text-slate-400 border-[#2D3B4E] hover:border-[#3D4B5E]"
                        )}
                      >
                        <span className="block text-base mb-0.5">{level.emoji}</span>
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Date */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Assessment Date
                  </Label>
                  <Input
                    type="date"
                    value={editTestDate}
                    onChange={(e) => setEditTestDate(e.target.value)}
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 focus:border-green-500/50"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-[#1E2A3A] border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Reset Onboarding</p>
                <p className="text-xs text-slate-500">Clear your profile and start fresh</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("recruitready_onboarding");
                  toast.success("Profile reset. Redirecting to onboarding...");
                  setTimeout(() => navigate("/onboarding"), 1000);
                }}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Reset
              </Button>
            </div>
            {isLoggedIn && (
              <>
                <Separator className="bg-[#2D3B4E]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Sign Out</p>
                    <p className="text-xs text-slate-500">Sign out of your account on this device</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cancel Membership Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-[#1E2A3A] border-[#2D3B4E] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Cancel Membership
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to cancel your{" "}
              <span className={currentTier.color}>{currentTier.label}</span> subscription?
              You'll be moved to the free Recruit plan.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 my-2">
            <p className="text-xs text-amber-400">
              <strong>What you'll lose:</strong>
            </p>
            <ul className="text-xs text-slate-400 mt-1 space-y-0.5">
              <li>• Cloud sync & backup</li>
              <li>• Full training plans</li>
              {subscriptionTier === "officer" && (
                <>
                  <li>• Personalised recommendations</li>
                  <li>• Priority support</li>
                </>
              )}
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="border-[#2D3B4E] text-slate-300 hover:bg-[#2D3B4E]"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelMembership}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0F1419] rounded-lg p-3">
      <p className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-green-400">{value}</p>
    </div>
  );
}