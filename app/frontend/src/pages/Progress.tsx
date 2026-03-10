import { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  branches,
  getStoredBranch,
  getProgressEntries,
  addProgressEntry,
  deleteProgressEntry,
  getWorkoutImage,
  getWorkoutVideo,
  getStreakInfo,
  type Branch,
  type ProgressEntry,
} from "@/lib/fitnessData";
import {
  fetchCloudProgress,
  createCloudProgress,
  deleteCloudProgress,
} from "@/lib/api-helpers";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Trash2,
  TrendingUp,
  Calendar,
  ChevronUp,
  Cloud,
  CloudOff,
  Play,
  ExternalLink,
  Award,
  Dumbbell,
  BarChart3,
  Info,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProgressPage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(getStoredBranch());
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showExerciseGuide, setShowExerciseGuide] = useState<string | null>(null);
  const branchInfo = branches.find((b) => b.id === selectedBranch)!;
  const streak = getStreakInfo();
  const { isLoggedIn } = useAuth();

  const loadEntries = useCallback(async () => {
    if (isLoggedIn) {
      const cloudEntries = await fetchCloudProgress();
      if (cloudEntries.length > 0) {
        setEntries(cloudEntries);
        return;
      }
    }
    setEntries(getProgressEntries());
  }, [isLoggedIn]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const branchEntries = useMemo(
    () =>
      entries
        .filter((e) => e.branch === selectedBranch)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries, selectedBranch]
  );

  const handleSubmit = async () => {
    const exercises = branchInfo.standards.map((std) => ({
      name: std.exercise,
      value: parseFloat(formValues[std.exercise] || "0"),
      unit: std.unit,
    }));

    if (exercises.every((e) => e.value === 0)) {
      toast.error("Please enter at least one value");
      return;
    }

    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      branch: selectedBranch,
      exercises,
    };

    setSaving(true);
    addProgressEntry(entry);

    if (isLoggedIn) {
      const success = await createCloudProgress(entry);
      if (success) {
        toast.success("Progress saved to cloud ☁️");
      } else {
        toast.success("Progress saved locally (cloud sync failed)");
      }
    } else {
      toast.success("Progress logged! Sign in to sync across devices.");
    }

    await loadEntries();
    setFormValues({});
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    deleteProgressEntry(id);
    if (isLoggedIn) {
      await deleteCloudProgress(id);
    }
    await loadEntries();
    toast.success("Entry deleted");
  };

  const getProgressPercent = (exerciseName: string, value: number) => {
    const std = branchInfo.standards.find((s) => s.exercise === exerciseName);
    if (!std) return 0;
    const genderKey = "male";
    const ageKey = "under30";
    const targetStr = std[genderKey][ageKey];
    const targetNum = parseFloat(targetStr.replace(":", "."));
    if (isNaN(targetNum) || targetNum === 0) return 0;
    if (std.unit === "minutes") {
      return value <= targetNum ? 100 : Math.max(0, Math.round((targetNum / value) * 100));
    }
    return Math.min(100, Math.round((value / targetNum) * 100));
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 75) return "bg-yellow-500";
    if (percent >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressLabel = (percent: number) => {
    if (percent >= 100) return "Target Met! 🎉";
    if (percent >= 75) return "Almost There 💪";
    if (percent >= 50) return "Good Progress";
    return "Keep Going";
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                Progress Tracker
              </h1>
              {isLoggedIn ? (
                <Badge className="bg-green-500/15 text-green-400 border-0 text-[10px] gap-1">
                  <Cloud className="w-3 h-3" /> Cloud
                </Badge>
              ) : (
                <Badge className="bg-slate-500/15 text-slate-400 border-0 text-[10px] gap-1">
                  <CloudOff className="w-3 h-3" /> Local
                </Badge>
              )}
              {streak.currentStreak > 0 && (
                <Badge className="bg-orange-500/15 text-orange-400 border-0 text-[10px] gap-1">
                  <Flame className="w-3 h-3" /> {streak.currentStreak} day streak
                </Badge>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Log your results, watch technique videos, and track improvement over time
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              {showForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Close" : "Log Entry"}
            </Button>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                selectedBranch === b.id
                  ? cn(b.bgColor, b.color, "border", b.borderColor)
                  : "bg-[#1E2A3A] text-slate-300 border border-[#2D3B4E] hover:border-[#3D4B5E]"
              )}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Exercise Guide Cards with Images & Videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-green-400" />
              Exercise Guides
            </h2>
            <p className="text-xs text-slate-400">Tap for technique tips & videos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchInfo.standards.map((std) => {
              const image = getWorkoutImage(std.exercise);
              const video = getWorkoutVideo(std.exercise);
              const isExpanded = showExerciseGuide === std.exercise;

              return (
                <Card
                  key={std.exercise}
                  className={cn(
                    "bg-[#1E2A3A] border-[#2D3B4E] overflow-hidden transition-all duration-300 cursor-pointer",
                    isExpanded ? "ring-1 ring-green-500/30" : "hover:border-[#3D4B5E]"
                  )}
                  onClick={() =>
                    setShowExerciseGuide(isExpanded ? null : std.exercise)
                  }
                >
                  {/* Exercise Image */}
                  {image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={image}
                        alt={std.exercise}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A3A] to-transparent" />
                      {video && (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </a>
                      )}
                      <div className="absolute bottom-2 left-3">
                        <Badge className={cn("text-[10px] border-0", branchInfo.bgColor, branchInfo.color)}>
                          {std.unit}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardContent className={cn("p-4", !image && "pt-4")}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-white">{std.exercise}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {std.description}
                        </p>
                      </div>
                      <Info className={cn("w-4 h-4 flex-shrink-0 mt-0.5 transition-colors", isExpanded ? "text-green-400" : "text-slate-500")} />
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#2D3B4E] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#0F1419] rounded-lg p-2.5">
                            <p className="text-[10px] text-slate-500">Male (Under 30)</p>
                            <p className="text-sm font-bold text-green-400">{std.male.under30}</p>
                          </div>
                          <div className="bg-[#0F1419] rounded-lg p-2.5">
                            <p className="text-[10px] text-slate-500">Female (Under 30)</p>
                            <p className="text-sm font-bold text-green-400">{std.female.under30}</p>
                          </div>
                          <div className="bg-[#0F1419] rounded-lg p-2.5">
                            <p className="text-[10px] text-slate-500">Male (30+)</p>
                            <p className="text-sm font-bold text-slate-300">{std.male.over30}</p>
                          </div>
                          <div className="bg-[#0F1419] rounded-lg p-2.5">
                            <p className="text-[10px] text-slate-500">Female (30+)</p>
                            <p className="text-sm font-bold text-slate-300">{std.female.over30}</p>
                          </div>
                        </div>
                        {video && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg p-2.5 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              Watch: {video.title}
                            </span>
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Log Form */}
        {showForm && (
          <Card className="bg-[#1E2A3A] border-[#2D3B4E] animate-in slide-in-from-top-4 duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Plus className="w-5 h-5 text-green-400" />
                Log New Entry — {branchInfo.name}
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Enter your latest results below. Leave blank for exercises you didn't do.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchInfo.standards.map((std) => {
                  const image = getWorkoutImage(std.exercise);
                  return (
                    <div key={std.exercise} className="space-y-2">
                      {image && (
                        <div className="relative h-20 rounded-lg overflow-hidden">
                          <img src={image} alt={std.exercise} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                          <p className="absolute bottom-2 left-3 text-xs font-semibold text-white">
                            {std.exercise}
                          </p>
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-slate-300 mb-1.5 block">
                          {std.exercise} ({std.unit})
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder={`Target: ${std.male.under30} ${std.unit}`}
                          value={formValues[std.exercise] || ""}
                          onChange={(e) =>
                            setFormValues({ ...formValues, [std.exercise]: e.target.value })
                          }
                          className="bg-[#0F1419] border-[#2D3B4E] text-white placeholder:text-slate-500 focus:border-green-500/50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? "Saving..." : "Save Entry"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormValues({});
                  }}
                  className="border-[#2D3B4E] text-slate-300 hover:bg-[#2D3B4E] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        {branchEntries.length > 0 && (
          <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Latest Results vs Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {branchInfo.standards.map((std) => {
                const latestValue = branchEntries[0]?.exercises.find(
                  (e) => e.name === std.exercise
                )?.value;
                const percent = latestValue ? getProgressPercent(std.exercise, latestValue) : 0;
                return (
                  <div key={std.exercise}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{std.exercise}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {latestValue !== undefined && (
                          <span className="text-sm font-bold tabular-nums text-white">
                            {latestValue}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          / {std.male.under30} {std.unit}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px] border-0",
                            percent >= 100
                              ? "bg-green-500/15 text-green-400"
                              : percent >= 75
                              ? "bg-yellow-500/15 text-yellow-400"
                              : "bg-amber-500/15 text-amber-400"
                          )}
                        >
                          {getProgressLabel(percent)}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-3 bg-[#0F1419] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 ease-out",
                          getProgressColor(percent)
                        )}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{percent}% of target</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* History */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            Session History
          </h2>
          {branchEntries.length === 0 ? (
            <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white font-semibold mb-1">No entries yet</p>
                <p className="text-slate-400 text-sm mb-4">
                  Start tracking your {branchInfo.name} fitness journey by logging your first session!
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Log Your First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {branchEntries.map((entry, index) => (
                <Card
                  key={entry.id}
                  className={cn(
                    "bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E] transition-colors",
                    index === 0 && "ring-1 ring-green-500/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-white">
                          {new Date(entry.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {index === 0 && (
                          <Badge className="bg-green-500/15 text-green-400 border-0 text-[10px]">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {entry.exercises
                        .filter((e) => e.value > 0)
                        .map((ex) => {
                          const percent = getProgressPercent(ex.name, ex.value);
                          return (
                            <div
                              key={ex.name}
                              className="bg-[#0F1419] rounded-lg p-3"
                            >
                              <p className="text-[10px] text-slate-400 mb-1 truncate">
                                {ex.name}
                              </p>
                              <div className="flex items-end gap-1">
                                <p className="text-lg font-extrabold tabular-nums text-white">
                                  {ex.value}
                                </p>
                                <p className="text-[10px] text-slate-500 mb-0.5">{ex.unit}</p>
                              </div>
                              <div className="h-1.5 bg-[#2D3B4E] rounded-full mt-2 overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    getProgressColor(percent)
                                  )}
                                  style={{ width: `${Math.min(100, percent)}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-500 mt-1">{percent}%</p>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Streak Motivation Footer */}
        <Card className={cn(
          "border",
          streak.currentStreak >= 3
            ? "bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20"
            : "bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20"
        )}>
          <CardContent className="p-5 text-center">
            {streak.currentStreak >= 3 ? (
              <>
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="font-semibold text-sm text-white mb-1">
                  🔥 {streak.currentStreak} Day Streak!
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {streak.currentStreak >= 7
                    ? "Incredible dedication! You're building unstoppable habits. Your best streak is " + streak.bestStreak + " days — keep pushing!"
                    : "You're building momentum! Log again tomorrow to keep your streak alive. Best streak: " + streak.bestStreak + " days."}
                </p>
              </>
            ) : (
              <>
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-sm text-white mb-1">
                  {streak.currentStreak > 0 ? `${streak.currentStreak} Day Streak — Keep Going!` : "Start Your Streak Today!"}
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Log your sessions regularly to build a streak. Consistency is the key to passing your fitness assessment — every rep counts!
                  {streak.bestStreak > 0 && ` Your best streak so far: ${streak.bestStreak} days.`}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}