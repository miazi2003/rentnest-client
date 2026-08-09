"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction } from "@/app/features/auth/actions/loginActions";
import { LoginState, type IUser } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import Link from "next/link";
import { ShieldCheck, UserRound, Building2, Lock, Mail, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_ACCOUNTS = [
  {
    role: "TENANT",
    label: "Tenant Demo",
    email: "tenant@rentnest.com",
    password: "Admin@RentNest2027",
    icon: UserRound,
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20",
  },
  {
    role: "LANDLORD",
    label: "Landlord Demo",
    email: "landlord@rentnest.com",
    password: "Landlord@RentNest2028",
    icon: Building2,
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20",
  },
  {
    role: "ADMIN",
    label: "Admin Demo",
    email: "admin@rentnest.com",
    password: "Tenant@RentNest2026",
    icon: ShieldCheck,
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20",
  },
];

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initialState: LoginState = {
    success: false,
    statusCode: null as number | null,
    message: "",
    data: null,
  };

  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      const authenticatedUser = state.data as IUser;
      setUser(authenticatedUser);

      const dashboardByRole: Record<IUser["role"], string> = {
        ADMIN: "/dashboard/admin",
        LANDLORD: "/dashboard/landlord",
        TENANT: "/dashboard/tenant",
      };

      window.dispatchEvent(new Event("rentnest:navigation-start"));
      router.replace(dashboardByRole[authenticatedUser.role] || "/dashboard");
    } else {
      toast.error(state.message);
    }
  }, [router, setUser, state]);

  const handleDemoFill = (demoEmail: string, demoPass: string, label: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${label}`);
  };

  return (
    <Card className="w-full shadow-none border-none bg-transparent p-0">
      <CardContent className="px-0 pb-0 space-y-6">
        {/* Quick 1-Click Demo Login Selector */}
        <div className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
       
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoFill(demo.email, demo.password, demo.label)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${demo.color}`}
                >
                  <Icon className="size-4 mb-1" />
                  <span className="truncate max-w-full">{demo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form action={formAction} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-foreground mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-foreground text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-foreground">
                Password <span className="text-rose-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-foreground text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground shadow-xs"
              />
            </div>
          </div>

          {state.message && !state.success && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-xs h-11"
          >
            {pending ? "Signing in..." : "Login to RentNest"}
          </Button>

          {/* Social Authentication Architecture Note */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/10 text-[11px] text-muted-foreground flex items-start gap-2 shadow-xs">
            <Info className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Social Login:</strong> RentNest uses custom JWT authentication. Social Login (Google/Facebook OAuth) requires backend OAuth endpoints before UI integration.
            </span>
          </div>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            New to RentNest?{" "}
            <Link href="/register" className="font-bold text-emerald-600 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
