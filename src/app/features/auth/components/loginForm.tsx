"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { loginAction } from "@/app/features/auth/actions/loginActions";
import { LoginState } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import type { IUser } from "../types";
import Link from "next/link";

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

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

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

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="px-0 pb-0">
        <form action={formAction} className="w-full space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl shadow-md shadow-emerald-700/15 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99] text-sm mt-2"
          >
            {pending ? "Signing in..." : "Login"}
          </button>
          <p className="pt-1 text-center text-xs text-gray-500">
            New to RentNest?{" "}
            <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-600">Create an account</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
