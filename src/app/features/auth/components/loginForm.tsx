"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { loginAction } from "@/app/features/auth/actions/loginActions";
import { LoginState } from "../types";
import { toast } from "sonner";

const LoginForm = () => {
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
    } else {
      toast.error(state.message);
    }
  }, [state]);

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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
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
                className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99] text-sm mt-2"
          >
            {pending ? "Signing in..." : "Login"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;