import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Dumbbell,
  Lightbulb,
  Menu,
  X,
  Shield,
  Calculator,
  CreditCard,
  User,
  LogIn,
  LogOut,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/standards", label: "Standards", icon: Target },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/training", label: "Training", icon: Dumbbell },
  { path: "/bmi", label: "BMI", icon: Calculator },
  { path: "/tips", label: "Tips", icon: Lightbulb },
];

const mobileNavItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/standards", label: "Standards", icon: Target },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/training", label: "Training", icon: Dumbbell },
  { path: "/bmi", label: "BMI", icon: Calculator },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, loading, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0F1419] text-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1A2332]/95 backdrop-blur-md border-b border-[#2D3B4E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-400" />
          <span className="font-bold text-lg tracking-tight">RecruitReady</span>
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <button
              onClick={isLoggedIn ? () => navigate("/account") : login}
              className="p-2 rounded-lg hover:bg-[#2D3B4E] transition-colors"
              title={isLoggedIn ? "My Account" : "Sign in"}
            >
              {isLoggedIn ? (
                <UserCircle className="w-5 h-5 text-green-400" />
              ) : (
                <LogIn className="w-5 h-5 text-slate-400" />
              )}
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#2D3B4E] transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[#1A2332] border-r border-[#2D3B4E] flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-[#2D3B4E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">RecruitReady</h1>
              <p className="text-xs text-slate-400">Fitness Preparation</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#2D3B4E]/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#2D3B4E] mt-2">
            <Link
              to="/pricing"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname === "/pricing"
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#2D3B4E]/50"
              )}
            >
              <CreditCard className="w-5 h-5" />
              Pricing
            </Link>
            <Link
              to="/account"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname === "/account"
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#2D3B4E]/50"
              )}
            >
              <UserCircle className="w-5 h-5" />
              Account
            </Link>
          </div>
        </nav>

        {/* Auth Section */}
        <div className="p-4 border-t border-[#2D3B4E]">
          {!loading && (
            <button
              onClick={isLoggedIn ? logout : login}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isLoggedIn
                  ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20"
              )}
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          )}

          <div className="mt-3 bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-green-400 font-semibold mb-1">PRO TIP</p>
            <p className="text-xs text-slate-400">
              Sign in to sync your progress across devices and never lose your data.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A2332]/95 backdrop-blur-md border-t border-[#2D3B4E] flex justify-around py-2 px-2">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-green-400" : "text-slate-500"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}