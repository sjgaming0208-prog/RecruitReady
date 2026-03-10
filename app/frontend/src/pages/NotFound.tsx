import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F1419] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <Shield className="w-16 h-16 text-slate-600 mb-6" />
      <h1 className="text-5xl font-extrabold mb-3">404</h1>
      <p className="text-slate-400 text-lg mb-6">Page not found. Fall back and regroup.</p>
      <Link to="/">
        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}