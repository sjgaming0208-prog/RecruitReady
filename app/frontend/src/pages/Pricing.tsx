import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield,
  Sword,
  Crown,
  Check,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  features: PlanFeature[];
  popular?: boolean;
  isPaid: boolean;
  paymentLink?: string;
}

const plans: Plan[] = [
  {
    id: "recruit",
    name: "Recruit",
    price: "Free",
    period: "",
    description: "Get started with basic fitness tracking and standards",
    icon: <Shield className="w-6 h-6" />,
    color: "text-slate-300",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    isPaid: false,
    features: [
      { text: "View all fitness standards", included: true },
      { text: "Basic progress tracking (local)", included: true },
      { text: "BMI Calculator", included: true },
      { text: "Preparation tips", included: true },
      { text: "Cloud sync & backup", included: false },
      { text: "Full training plans", included: false },
      { text: "Personalised recommendations", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "soldier",
    name: "Soldier",
    price: "£4.99",
    period: "/month",
    description: "Cloud sync, full training plans and more",
    icon: <Sword className="w-6 h-6" />,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    popular: true,
    isPaid: true,
    paymentLink: "https://buy.stripe.com/4gMbIUcZe8I8cZp53TaIM01",
    features: [
      { text: "View all fitness standards", included: true },
      { text: "Advanced progress tracking", included: true },
      { text: "BMI Calculator", included: true },
      { text: "Preparation tips", included: true },
      { text: "Cloud sync & backup", included: true },
      { text: "Full training plans", included: true },
      { text: "Personalised recommendations", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "officer",
    name: "Officer",
    price: "£9.99",
    period: "/month",
    description: "Everything included plus personalised coaching",
    icon: <Crown className="w-6 h-6" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    isPaid: true,
    paymentLink: "https://buy.stripe.com/5kQfZae3i7E44sTfIxaIM00",
    features: [
      { text: "View all fitness standards", included: true },
      { text: "Advanced progress tracking", included: true },
      { text: "BMI Calculator", included: true },
      { text: "Preparation tips", included: true },
      { text: "Cloud sync & backup", included: true },
      { text: "Full training plans", included: true },
      { text: "Personalised recommendations", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export default function PricingPage() {
  const { subscriptionTier } = useAuth();

  const handleSelectPlan = (plan: Plan) => {
    if (!plan.isPaid || !plan.paymentLink) return;
    window.open(plan.paymentLink, "_blank");
  };

  const getButtonText = (plan: Plan) => {
    const isCurrentPlan = subscriptionTier === plan.id;
    if (isCurrentPlan) return "Current Plan";
    if (!plan.isPaid) return "Get Started";
    return "Subscribe Now";
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-green-500/10 text-green-400 border-0 mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Subscription Plans
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Choose Your Plan
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Upgrade to unlock cloud sync, full training plans, and personalised
            recommendations to maximise your assessment readiness.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = subscriptionTier === plan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative border transition-all duration-200",
                  plan.popular
                    ? "bg-gradient-to-b from-[#1E2A3A] to-[#1A2332] border-green-500/40 ring-1 ring-green-500/20"
                    : "bg-[#1E2A3A] border-[#2D3B4E] hover:border-[#3D4B5E]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-600 text-white border-0 text-[10px] px-3">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4 pt-6">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3",
                      plan.bgColor
                    )}
                  >
                    <div className={plan.color}>{plan.icon}</div>
                  </div>
                  <CardTitle className="text-lg text-white">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className={cn("text-3xl font-extrabold", plan.color)}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-slate-500">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            feature.included ? "text-slate-300" : "text-slate-600"
                          )}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan}
                    className={cn(
                      "w-full",
                      isCurrentPlan
                        ? "bg-[#2D3B4E] text-slate-400 cursor-not-allowed"
                        : plan.popular
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-[#2D3B4E] hover:bg-[#3D4B5E] text-slate-200"
                    )}
                  >
                    {getButtonText(plan)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="bg-[#1E2A3A] border-[#2D3B4E] max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg text-center mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1 text-green-400">Can I cancel anytime?</p>
                <p className="text-xs text-slate-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 text-green-400">What happens to my data if I downgrade?</p>
                <p className="text-xs text-slate-400">
                  Your data is always safe. If you downgrade, your cloud-synced data remains stored and will be accessible again if you upgrade.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 text-green-400">Is there a free trial?</p>
                <p className="text-xs text-slate-400">
                  The Recruit plan is completely free forever. You can try all basic features before deciding to upgrade.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 text-green-400">How secure is the payment?</p>
                <p className="text-xs text-slate-400">
                  All payments are processed securely through Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}