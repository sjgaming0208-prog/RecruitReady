import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Heart, Info, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bgColor: string;
  advice: string;
}

function calculateBMI(heightCm: number, weightKg: number): BMIResult | null {
  if (heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) {
    return {
      bmi,
      category: "Underweight",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      advice:
        "You may need to gain weight. Focus on calorie-dense, nutritious foods and strength training to build muscle mass for your fitness assessment.",
    };
  } else if (bmi < 25) {
    return {
      bmi,
      category: "Normal Weight",
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
      advice:
        "You're in a healthy weight range. Maintain your current diet and exercise routine. Focus on building strength and endurance for your assessment.",
    };
  } else if (bmi < 30) {
    return {
      bmi,
      category: "Overweight",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      advice:
        "Consider incorporating more cardio and watching your calorie intake. Losing even a small amount of weight can significantly improve your run times.",
    };
  } else {
    return {
      bmi,
      category: "Obese",
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20",
      advice:
        "It's important to work on weight loss before attempting fitness assessments. Consult a healthcare professional and start with low-impact exercises.",
    };
  }
}

const bmiRanges = [
  { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
  { label: "Normal", range: "18.5 - 24.9", color: "bg-green-500" },
  { label: "Overweight", range: "25 - 29.9", color: "bg-amber-500" },
  { label: "Obese", range: "≥ 30", color: "bg-red-500" },
];

export default function BMIPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = () => {
    let heightCm: number;
    let weightKg: number;

    if (unit === "metric") {
      heightCm = parseFloat(height);
      weightKg = parseFloat(weight);
    } else {
      const totalInches = parseFloat(feet) * 12 + parseFloat(inches || "0");
      heightCm = totalInches * 2.54;
      weightKg = parseFloat(weight) * 0.453592;
    }

    const bmiResult = calculateBMI(heightCm, weightKg);
    setResult(bmiResult);
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setFeet("");
    setInches("");
    setResult(null);
  };

  const isValid =
    unit === "metric"
      ? parseFloat(height) > 0 && parseFloat(weight) > 0
      : parseFloat(feet) > 0 && parseFloat(weight) > 0;

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            BMI Calculator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Check your Body Mass Index and see how it affects your fitness goals
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-green-400" />
              Calculate Your BMI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Unit Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setUnit("metric")}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                  unit === "metric"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-[#0F1419] text-slate-400 border border-[#2D3B4E] hover:border-[#3D4B5E]"
                )}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                  unit === "imperial"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-[#0F1419] text-slate-400 border border-[#2D3B4E] hover:border-[#3D4B5E]"
                )}
              >
                Imperial (ft / lbs)
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit === "metric" ? (
                <div>
                  <Label className="text-xs text-slate-400 mb-1.5 block">
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-400 mb-1.5 block">
                      Height (feet)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400 mb-1.5 block">
                      Inches
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 10"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                    />
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs text-slate-400 mb-1.5 block">
                  Weight ({unit === "metric" ? "kg" : "lbs"})
                </Label>
                <Input
                  type="number"
                  placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-[#0F1419] border-[#2D3B4E] text-slate-100 placeholder:text-slate-600 focus:border-green-500/50"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                disabled={!isValid}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-40"
              >
                Calculate BMI
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-[#2D3B4E] text-slate-400 hover:bg-[#2D3B4E] hover:text-slate-200 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card
            className={cn(
              "border animate-in slide-in-from-top-4 duration-300",
              result.bgColor
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-xs text-slate-400 mb-1">Your BMI</p>
                  <p className={cn("text-5xl font-extrabold tabular-nums", result.color)}>
                    {result.bmi.toFixed(1)}
                  </p>
                  <Badge className={cn("mt-2 border-0 text-xs font-semibold", result.bgColor, result.color)}>
                    {result.category}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <Heart className={cn("w-5 h-5 mt-0.5 flex-shrink-0", result.color)} />
                    <div>
                      <p className="font-semibold text-sm mb-1">What this means for your fitness</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{result.advice}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual BMI Scale */}
              <div className="mt-6">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 flex-1" />
                  <div className="bg-green-500 flex-1" />
                  <div className="bg-amber-500 flex-1" />
                  <div className="bg-red-500 flex-1" />
                </div>
                <div
                  className="relative mt-1"
                  style={{
                    paddingLeft: `${Math.min(95, Math.max(5, ((result.bmi - 10) / 35) * 100))}%`,
                  }}
                >
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white -ml-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BMI Ranges Reference */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Info className="w-5 h-5 text-blue-400" />
              BMI Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bmiRanges.map((range) => (
                <div key={range.label} className="bg-[#0F1419] rounded-lg p-3">
                  <div className={cn("w-3 h-3 rounded-full mb-2", range.color)} />
                  <p className="text-sm font-semibold text-white">{range.label}</p>
                  <p className="text-xs text-slate-500">{range.range}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-amber-400 mb-1">Important Note</p>
                <p className="text-xs text-slate-400">
                  BMI is a general indicator and doesn't account for muscle mass, bone density, or body composition. 
                  Athletes and military personnel often have higher BMI due to muscle mass. 
                  Consult a healthcare professional for a comprehensive fitness assessment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}