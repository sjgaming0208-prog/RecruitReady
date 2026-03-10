import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { branches, getStoredBranch, type Branch } from "@/lib/fitnessData";
import { Dumbbell, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrainingPage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(getStoredBranch());
  const branchInfo = branches.find((b) => b.id === selectedBranch)!;

  const getDayColor = (workout: string) => {
    const lower = workout.toLowerCase();
    if (lower.includes("rest") || lower.includes("recovery"))
      return "text-slate-500 bg-slate-500/10";
    if (lower.includes("test") || lower.includes("assessment"))
      return "text-amber-400 bg-amber-500/10";
    if (lower.includes("run") || lower.includes("cardio") || lower.includes("interval") || lower.includes("sprint") || lower.includes("fartlek") || lower.includes("tempo"))
      return "text-blue-400 bg-blue-500/10";
    if (lower.includes("strength") || lower.includes("press") || lower.includes("push") || lower.includes("upper") || lower.includes("body"))
      return "text-red-400 bg-red-500/10";
    if (lower.includes("circuit") || lower.includes("full"))
      return "text-purple-400 bg-purple-500/10";
    if (lower.includes("swim"))
      return "text-cyan-400 bg-cyan-500/10";
    return "text-green-400 bg-green-500/10";
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Training Plans
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            4-week structured programmes to get you assessment-ready
          </p>
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
                  : "bg-[#1E2A3A] text-slate-400 border border-[#2D3B4E] hover:border-[#3D4B5E]"
              )}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Programme Info */}
        <Card className="bg-gradient-to-br from-[#1E2A3A] to-[#1A2332] border-[#2D3B4E]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", branchInfo.bgColor)}>
                <Dumbbell className={cn("w-5 h-5", branchInfo.color)} />
              </div>
              <div>
                <h2 className="font-bold text-white">{branchInfo.name} — 4 Week Programme</h2>
                <p className="text-xs text-slate-400">Progressive overload to peak for assessment day</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px]">
                Cardio
              </Badge>
              <Badge className="bg-red-500/10 text-red-400 border-0 text-[10px]">
                Strength
              </Badge>
              <Badge className="bg-purple-500/10 text-purple-400 border-0 text-[10px]">
                Circuits
              </Badge>
              <Badge className="bg-slate-500/10 text-slate-400 border-0 text-[10px]">
                Recovery
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
                Test Day
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Plans */}
        <Accordion type="single" collapsible defaultValue="week-1" className="space-y-3">
          {branchInfo.trainingPlan.map((week) => (
            <AccordionItem
              key={`week-${week.week}`}
              value={`week-${week.week}`}
              className="bg-[#1E2A3A] border border-[#2D3B4E] rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-[#2D3B4E]/30 transition-colors [&[data-state=open]>div>.week-arrow]:rotate-90">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-extrabold text-sm">W{week.week}</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Week {week.week}: {week.title}</p>
                    <p className="text-xs text-slate-500">{week.days.length} sessions planned</p>
                  </div>
                  <ChevronRight className="week-arrow w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-2 mt-2">
                  {week.days.map((day, idx) => {
                    const colorClass = getDayColor(day.workout);
                    return (
                      <div
                        key={idx}
                        className="bg-[#0F1419] rounded-xl p-4 border border-[#2D3B4E]/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold", colorClass)}>
                            {day.day}
                          </div>
                          <span className="font-semibold text-sm text-white">{day.workout}</span>
                        </div>
                        <p className="text-xs text-slate-400 ml-11">{day.details}</p>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-amber-400 mb-1">Training Tip</p>
                <p className="text-xs text-slate-400">
                  Follow the plan consistently but listen to your body. If you feel pain (not just discomfort), take an extra rest day. 
                  Consistency over 4 weeks beats one intense week followed by injury. Adjust weights and distances to your current level and progress gradually.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}