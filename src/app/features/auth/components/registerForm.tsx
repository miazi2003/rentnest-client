"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { registerState } from "../types";
import { toast } from "sonner";
import { registerAction } from "@/app/features/auth/actions/registerAction";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Phone, Building2, UserRound } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButtons";

const RegisterForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("TENANT");

  const initialState: registerState = {
    success: false,
    statusCode: null as number | null,
    message: "",
    data: null,
  };

  const [state, formAction, pending] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message || "Account created successfully! Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Card className="w-full shadow-none border-none bg-transparent p-0">
      <CardContent className="px-0 pb-0">
        <form action={formAction} className="w-full space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-foreground mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-foreground text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground shadow-xs"
              />
            </div>
          </div>

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
            <label htmlFor="phone" className="block text-xs font-bold text-foreground mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-foreground text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              Select Account Type <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                  role === "TENANT"
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="TENANT"
                  checked={role === "TENANT"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                <UserRound className="size-4" />
                <span>Tenant</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                  role === "LANDLORD"
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="LANDLORD"
                  checked={role === "LANDLORD"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                <Building2 className="size-4" />
                <span>Landlord</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-foreground mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
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
            {pending ? "Creating Account..." : "Create Account"}
          </Button>

          <SocialLoginButtons />

          <p className="pt-2 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
