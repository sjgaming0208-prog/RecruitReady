import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { branches, setStoredBranch, type Branch } from "@/lib/fitnessData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  User,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ONBOARDING_KEY = "recruitready_onboarding";

export interface UserProfile {
  branch: Branch;
  name: string;
  age: string;
  gender: "male" | "female";
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  testDate: string;
}

export function getOnboardingProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(ONBOARDING_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveOnboardingProfile(profile: UserProfile): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
  setStoredBranch(profile.branch);
}

export function hasCompletedOnboarding(): boolean {
  return !!localStorage.getItem(ONBOARDING_KEY);
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [fitnessLevel, setFitnessLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [testDate, setTestDate] = useState("");

  const handleComplete = () => {
    if (!selectedBranch) return;
    const profile: UserProfile = {
      branch: selectedBranch,
      name: name.trim() || "Recruit",
      age: age || "25",
      gender,
      fitnessLevel,
      testDate,
    };
    saveOnboardingProfile(profile);
    navigate("/");
  };

  const canProceedStep0 = !!selectedBranch;
  const canProceedStep1 = true; // details are optional
  const canComplete = !!selectedBranch;

  return (
    <div className="min-h-screen bg-[#0F1419] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">RecruitReady</h1>
          <p className="text-xs text-slate-500">Fitness Preparation</p>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-500",
                s <= step ? "bg-green-500" : "bg-[#2D3B4E]"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Step {step + 1} of 3
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {/* Step 0: Pick Service Branch */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-green-400">
                Which service are you preparing for?
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Select your target branch. This determines the fitness standards
                and training plan we'll show you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((branch) => {
                const isSelected = selectedBranch === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={cn(
                      "relative rounded-2xl overflow-hidden h-44 lg:h-52 transition-all duration-300 group text-left",
                      isSelected
                        ? "ring-2 ring-green-500 ring-offset-2 ring-offset-[#0F1419]"
                        : "ring-1 ring-[#2D3B4E] hover:ring-[#3D4B5E]"
                    )}
                  >
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="relative h-full flex flex-col justify-end p-5">
                      <Badge
                        className={cn(
                          "w-fit mb-2 text-[10px] border-0",
                          branch.bgColor,
                          branch.color
                        )}
                      >
                        {branch.fullName}
                      </Badge>
                      <p className="font-bold text-lg text-white">
                        {branch.name}
                      </p>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {branch.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Enter Details */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 max-w-lg">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-green-400">
                Tell us about yourself
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                We'll personalise your targets based on your details. All fields
                are optional.
              </p>
            </div>

            <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
              <CardContent className="p-5 space-y-5">
                {/* Name */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Name
                  </Label>
                  <Input
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="e.g. 22"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">
                    Gender
                  </Label>
                  <div className="flex gap-3">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border",
                          gender === g
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
                    <Target className="w-3.5 h-3.5" /> Current Fitness Level
                  </Label>
                  <div className="flex gap-2">
                    {(
                      [
                        { id: "beginner", label: "Beginner", emoji: "🌱" },
                        {
                          id: "intermediate",
                          label: "Intermediate",
                          emoji: "💪",
                        },
                        { id: "advanced", label: "Advanced", emoji: "🔥" },
                      ] as const
                    ).map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFitnessLevel(level.id)}
                        className={cn(
                          "flex-1 py-2.5 rounded-lg text-xs font-medium transition-all border",
                          fitnessLevel === level.id
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-[#0F1419] text-slate-400 border-[#2D3B4E] hover:border-[#3D4B5E]"
                        )}
                      >
                        <span className="block text-base mb-0.5">
                          {level.emoji}
                        </span>
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Date */}
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Assessment Date
                    (optional)
                  </Label>
                  <Input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 focus:border-green-500/50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && selectedBranch && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 max-w-lg">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-green-400">
                You're all set!
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Here's a summary of your profile. You can change these later in
                settings.
              </p>
            </div>

            <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
              <CardContent className="p-5 space-y-4">
                {/* Branch Preview */}
                {(() => {
                  const branch = branches.find(
                    (b) => b.id === selectedBranch
                  )!;
                  return (
                    <div className="relative rounded-xl overflow-hidden h-36">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="relative h-full flex flex-col justify-end p-4">
                        <Badge
                          className={cn(
                            "w-fit mb-1 text-[10px] border-0",
                            branch.bgColor,
                            branch.color
                          )}
                        >
                          {branch.fullName}
                        </Badge>
                        <p className="font-bold text-white">{branch.name}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Details Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <SummaryItem label="Name" value={name || "Recruit"} />
                  <SummaryItem label="Age" value={age || "25"} />
                  <SummaryItem
                    label="Gender"
                    value={gender === "male" ? "Male" : "Female"}
                  />
                  <SummaryItem
                    label="Fitness"
                    value={
                      fitnessLevel.charAt(0).toUpperCase() +
                      fitnessLevel.slice(1)
                    }
                  />
                  {testDate && (
                    <SummaryItem
                      label="Test Date"
                      value={new Date(testDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-green-400 mb-1">
                      What's next?
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• View your personalised fitness standards</li>
                      <li>• Start logging your progress</li>
                      <li>• Follow a structured 4-week training plan</li>
                      <li>• Sign in to sync your data across devices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 border-t border-[#2D3B4E] bg-[#0F1419] flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="border-[#2D3B4E] text-slate-400 hover:bg-[#2D3B4E] hover:text-slate-200 gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step < 2 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 disabled:opacity-40"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8"
          >
            Let's Go!
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0F1419] rounded-lg p-3">
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-green-400">{value}</p>
    </div>
  );
}