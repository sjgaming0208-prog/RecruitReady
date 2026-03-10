import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { tips } from "@/lib/fitnessData";
import { Lightbulb, CheckCircle2 } from "lucide-react";

const assessmentChecklist = [
  "Confirmed assessment date and location",
  "Practiced exact test format (treadmill incline, bleep test audio, etc.)",
  "Prepared ID and required documents",
  "Planned transport and arrival time (aim 30 min early)",
  "Laid out appropriate clothing and trainers",
  "Prepared light meal plan for 2-3 hours before",
  "Packed water bottle",
  "Set alarm with backup alarm",
  "Completed at least one full mock assessment",
  "Rested fully the day before",
];

export default function TipsPage() {
  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Preparation Tips
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Everything you need to know to ace your fitness assessment
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <Card
              key={idx}
              className="bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E] transition-all duration-200 hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <h3 className="font-bold text-base mb-2 text-white">{tip.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessment Day Checklist */}
        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-600/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Assessment Day Checklist</h2>
                <p className="text-xs text-slate-400">Make sure you've ticked everything off</p>
              </div>
            </div>
            <div className="space-y-3">
              {assessmentChecklist.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-[#2D3B4E] bg-[#0F1419] text-green-500 focus:ring-green-500/30 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivation Quote */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <blockquote className="text-lg font-semibold italic text-slate-200 max-w-lg mx-auto">
              "The more you sweat in training, the less you bleed in combat."
            </blockquote>
            <p className="text-sm text-slate-500 mt-3">— Richard Marcinko</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}