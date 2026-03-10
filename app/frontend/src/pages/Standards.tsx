import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { branches, type Branch } from "@/lib/fitnessData";
import { getStoredBranch } from "@/lib/fitnessData";
import { Target, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StandardsPage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(getStoredBranch());
  const [ageGroup, setAgeGroup] = useState<"under30" | "over30">("under30");
  const branchInfo = branches.find((b) => b.id === selectedBranch)!;

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Fitness Standards
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Official fitness test requirements for each service branch
          </p>
        </div>

        {/* Branch Tabs */}
        <Tabs value={selectedBranch} onValueChange={(v) => setSelectedBranch(v as Branch)}>
          <TabsList className="bg-[#1A2332] border border-[#2D3B4E] w-full grid grid-cols-4 h-auto p-1">
            {branches.map((b) => (
              <TabsTrigger
                key={b.id}
                value={b.id}
                className={cn(
                  "text-xs lg:text-sm py-2.5 data-[state=active]:bg-[#2D3B4E] data-[state=active]:text-white rounded-lg"
                )}
              >
                {b.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {branches.map((branch) => (
            <TabsContent key={branch.id} value={branch.id} className="mt-6 space-y-6">
              {/* Branch Info Card */}
              <Card className="bg-[#1E2A3A] border-[#2D3B4E] overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A3A] via-[#1E2A3A]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className={cn("text-xs font-semibold border-0", branch.bgColor, branch.color)}>
                      {branch.fullName}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-slate-300">{branch.description}</p>
                </CardContent>
              </Card>

              {/* Age/Gender Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Age Group:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAgeGroup("under30")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                      ageGroup === "under30"
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : "bg-[#1E2A3A] text-slate-400 border border-[#2D3B4E] hover:border-[#3D4B5E]"
                    )}
                  >
                    Under 30
                  </button>
                  <button
                    onClick={() => setAgeGroup("over30")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                      ageGroup === "over30"
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : "bg-[#1E2A3A] text-slate-400 border border-[#2D3B4E] hover:border-[#3D4B5E]"
                    )}
                  >
                    Over 30
                  </button>
                </div>
              </div>

              {/* Standards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branch.standards.map((std) => (
                  <Card
                    key={std.exercise}
                    className="bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E] transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", branch.bgColor)}>
                          <Target className={cn("w-5 h-5", branch.color)} />
                        </div>
                        <div>
                          <CardTitle className="text-base text-white">{std.exercise}</CardTitle>
                          <p className="text-xs text-slate-500">Unit: {std.unit}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-slate-400">{std.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0F1419] rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Male</span>
                          </div>
                          <p className="text-xl font-extrabold tabular-nums text-white">
                            {ageGroup === "under30" ? std.male.under30 : std.male.over30}
                          </p>
                          <p className="text-[10px] text-slate-500">{std.unit}</p>
                        </div>
                        <div className="bg-[#0F1419] rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-3.5 h-3.5 text-pink-400" />
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Female</span>
                          </div>
                          <p className="text-xl font-extrabold tabular-nums text-white">
                            {ageGroup === "under30" ? std.female.under30 : std.female.over30}
                          </p>
                          <p className="text-[10px] text-slate-500">{std.unit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}