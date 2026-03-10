import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  branches,
  getStoredBranch,
  setStoredBranch,
  getProgressEntries,
  getStreakInfo,
  type Branch,
  type BranchInfo,
} from "@/lib/fitnessData";
import { getOnboardingProfile } from "./Onboarding";
import {
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Flame,
  Trophy,
  Zap,
  Calculator,
  Cloud,
  CloudOff,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

function getLatestStats(branch: Branch) {
  const entries = getProgressEntries().filter((e) => e.branch === branch);
  const totalEntries = entries.length;
  const latestEntry = entries[entries.length - 1];
  const branchData = branches.find((b) => b.id === branch)!;

  let overallProgress = 0;
  if (latestEntry && branchData.standards.length > 0) {
    const progressPerExercise = branchData.standards.map((std) => {
      const logged = latestEntry.exercises.find((e) => e.name === std.exercise);
      if (!logged) return 0;
      const targetStr = std.male.under30;
      const targetNum = parseFloat(targetStr.replace(":", "."));
      if (isNaN(targetNum) || targetNum === 0) return 0;
      if (std.unit === "minutes") {
        const loggedMin = logged.value;
        return loggedMin <= targetNum ? 100 : Math.max(0, (targetNum / loggedMin) * 100);
      }
      return Math.min(100, (logged.value / targetNum) * 100);
    });
    overallProgress = Math.round(
      progressPerExercise.reduce((a, b) => a + b, 0) / progressPerExercise.length
    );
  }

  return { totalEntries, overallProgress, latestEntry };
}

function getDaysUntilTest(testDate: string): number | null {
  if (!testDate) return null;
  const diff = new Date(testDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
  const profile = getOnboardingProfile();
  const [selectedBranch, setSelectedBranch] = useState<Branch>(
    profile?.branch || getStoredBranch()
  );
  const branchInfo = branches.find((b) => b.id === selectedBranch)!;
  const stats = getLatestStats(selectedBranch);
  const streak = getStreakInfo();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const daysUntilTest = profile?.testDate ? getDaysUntilTest(profile.testDate) : null;
  const genderLabel = profile?.gender === "female" ? "Female" : "Male";
  const ageGroup = profile?.age && parseInt(profile.age) >= 30 ? "over30" : "under30";

  useEffect(() => {
    setStoredBranch(selectedBranch);
  }, [selectedBranch]);

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden h-[280px] lg:h-[340px]">
          <img
            src={branchInfo.image}
            alt={branchInfo.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1419] via-[#0F1419]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1419]/80 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className={cn("w-fit text-xs font-semibold", branchInfo.bgColor, branchInfo.color, "border-0")}>
                {branchInfo.fullName}
              </Badge>
              {isLoggedIn ? (
                <Badge className="bg-green-500/15 text-green-400 border-0 text-[10px] gap-1">
                  <Cloud className="w-3 h-3" /> Synced
                </Badge>
              ) : (
                <Badge className="bg-slate-500/15 text-slate-400 border-0 text-[10px] gap-1">
                  <CloudOff className="w-3 h-3" /> Local
                </Badge>
              )}
              {profile && (
                <Badge className="bg-slate-500/15 text-slate-300 border-0 text-[10px]">
                  {genderLabel} · {profile.age || "25"}yrs
                </Badge>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 text-white">
              {profile?.name ? `Welcome back, ${profile.name}` : "Get Recruit Ready"}
            </h1>
            <p className="text-slate-300 text-sm lg:text-base max-w-lg">
              Track your fitness, hit your targets, and prepare for your {branchInfo.name} assessment with confidence.
            </p>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              isSelected={selectedBranch === branch.id}
              onClick={() => setSelectedBranch(branch.id)}
            />
          ))}
        </div>

        {/* Streak Banner */}
        <Card className={cn(
          "border overflow-hidden",
          streak.currentStreak >= 7
            ? "bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-yellow-500/15 border-orange-500/30"
            : streak.currentStreak >= 3
            ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/20"
            : "bg-[#1E2A3A] border-[#2D3B4E]"
        )}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {/* Flame Icon with Streak Count */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  streak.currentStreak >= 7
                    ? "bg-gradient-to-br from-orange-500/30 to-amber-500/30"
                    : streak.currentStreak >= 3
                    ? "bg-orange-500/20"
                    : "bg-orange-500/10"
                )}>
                  <Flame className={cn(
                    "w-8 h-8",
                    streak.currentStreak >= 7
                      ? "text-orange-400 animate-pulse"
                      : streak.currentStreak >= 1
                      ? "text-orange-400"
                      : "text-slate-500"
                  )} />
                </div>
                {streak.currentStreak > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    {streak.currentStreak}
                  </div>
                )}
              </div>

              {/* Streak Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-extrabold tabular-nums text-orange-400">
                    {streak.currentStreak} Day{streak.currentStreak !== 1 ? "s" : ""}
                  </p>
                  {streak.isActiveToday && (
                    <Badge className="bg-green-500/15 text-green-400 border-0 text-[10px]">
                      ✓ Today
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white font-medium">
                  {streak.currentStreak === 0
                    ? "Start your streak — log a session today!"
                    : streak.currentStreak >= 7
                    ? "You're on fire! Keep the momentum going! 🔥"
                    : streak.currentStreak >= 3
                    ? "Great consistency! Don't break the chain! 💪"
                    : "Streak started — keep logging daily!"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-slate-400">
                      Best: <span className="text-amber-400 font-bold">{streak.bestStreak} day{streak.bestStreak !== 1 ? "s" : ""}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      Total: <span className="text-white font-bold">{streak.totalDaysLogged} day{streak.totalDaysLogged !== 1 ? "s" : ""}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Dots */}
              <div className="hidden sm:flex flex-col items-center gap-1">
                <p className="text-[10px] text-slate-500 mb-1">This Week</p>
                <div className="flex gap-1">
                  {(() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dayOfWeek = today.getDay();
                    const monday = new Date(today);
                    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
                    const entries = getProgressEntries();
                    const loggedDates = new Set(entries.map((e) => e.date.split("T")[0]));
                    const days = ["M", "T", "W", "T", "F", "S", "S"];
                    return days.map((label, i) => {
                      const d = new Date(monday);
                      d.setDate(monday.getDate() + i);
                      const dateStr = d.toISOString().split("T")[0];
                      const isLogged = loggedDates.has(dateStr);
                      const isToday = dateStr === today.toISOString().split("T")[0];
                      const isFuture = d > today;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] text-slate-500">{label}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                            isLogged
                              ? "bg-green-500 shadow-lg shadow-green-500/20"
                              : isToday
                              ? "bg-[#2D3B4E] ring-1 ring-green-500/50"
                              : isFuture
                              ? "bg-[#1A2332]"
                              : "bg-[#2D3B4E]"
                          )}>
                            {isLogged && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-400" />}
            label="Sessions Logged"
            value={stats.totalEntries.toString()}
            sublabel="total entries"
            color="orange"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5 text-green-400" />}
            label="Overall Readiness"
            value={`${stats.overallProgress}%`}
            sublabel="toward targets"
            color="green"
          />
          {daysUntilTest !== null ? (
            <StatCard
              icon={<Calendar className="w-5 h-5 text-blue-400" />}
              label="Days Until Test"
              value={daysUntilTest.toString()}
              sublabel={`${new Date(profile!.testDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
              color="blue"
            />
          ) : (
            <StatCard
              icon={<Zap className="w-5 h-5 text-blue-400" />}
              label="Standards to Meet"
              value={branchInfo.standards.length.toString()}
              sublabel={`for ${branchInfo.name}`}
              color="blue"
            />
          )}
        </div>

        {/* Fitness Standards Preview — personalised by gender/age */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Your Fitness Targets
              <span className="text-xs text-slate-500 ml-2 font-normal">
                ({genderLabel}, {ageGroup === "under30" ? "Under 30" : "30+"})
              </span>
            </h2>
            <Link
              to="/standards"
              className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {branchInfo.standards.map((std) => {
              const target =
                profile?.gender === "female"
                  ? std.female[ageGroup]
                  : std.male[ageGroup];
              return (
                <Card
                  key={std.exercise}
                  className="bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E] transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-100">{std.exercise}</p>
                        <p className="text-xs text-slate-400 mt-1">{std.description}</p>
                      </div>
                      <Target className={cn("w-5 h-5 mt-0.5 flex-shrink-0", branchInfo.color)} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Your target:</span>
                      <span className="font-bold text-lg text-green-400">
                        {target}
                      </span>
                      <span className="text-xs text-slate-500">{std.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickLink
            to="/progress"
            icon={<TrendingUp className="w-5 h-5" />}
            title="Log Progress"
            description="Record your latest fitness results"
            color="green"
          />
          <QuickLink
            to="/training"
            icon={<Calendar className="w-5 h-5" />}
            title="Training Plan"
            description="Follow a structured 4-week programme"
            color="blue"
          />
          <QuickLink
            to="/bmi"
            icon={<Calculator className="w-5 h-5" />}
            title="BMI Calculator"
            description="Check your Body Mass Index"
            color="purple"
          />
          <QuickLink
            to="/tips"
            icon={<Target className="w-5 h-5" />}
            title="Preparation Tips"
            description="Nutrition, mental prep & assessment day"
            color="amber"
          />
        </div>

        {/* Edit Profile Link */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("recruitready_onboarding");
              navigate("/onboarding");
            }}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Change service branch or details
          </button>
        </div>
      </div>
    </Layout>
  );
}

function BranchCard({
  branch,
  isSelected,
  onClick,
}: {
  branch: BranchInfo;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden h-24 lg:h-28 transition-all duration-300 group",
        isSelected
          ? `ring-2 ring-offset-2 ring-offset-[#0F1419] ${branch.borderColor.replace("border-", "ring-")}`
          : "ring-1 ring-[#2D3B4E] hover:ring-[#3D4B5E]"
      )}
    >
      <img
        src={branch.image}
        alt={branch.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="relative h-full flex flex-col justify-end p-3">
        <p className={cn("font-bold text-sm", isSelected ? branch.color : "text-white")}>
          {branch.name}
        </p>
      </div>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  const bgMap: Record<string, string> = {
    orange: "bg-orange-500/10 border-orange-500/20",
    green: "bg-green-500/10 border-green-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
  };
  return (
    <Card className={cn("border", bgMap[color] || "bg-[#1E2A3A] border-[#2D3B4E]")}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
        <p className="text-3xl font-extrabold tabular-nums text-green-400">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{sublabel}</p>
      </CardContent>
    </Card>
  );
}

function QuickLink({
  to,
  icon,
  title,
  description,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: "text-green-400 bg-green-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };
  return (
    <Link to={to}>
      <Card className="bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-5 flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[color])}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-green-400">{title}</p>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}