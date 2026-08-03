"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { registerState } from "../types";
import { toast } from "sonner";
import { registerAction } from "@/app/features/auth/actions/registerAction";
import Link from "next/link";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const initialState: registerState = {
    success: false,
    statusCode: null as number | null,
    message: "",
    data: null,
  };

  const [state, formAction, pending] = useActionState(
    registerAction,
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>

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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
            </div>
            <input
              id="phone"
              type="number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012........"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Role
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="LANDLORD"
                  checked={role === "LANDLORD"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-emerald-600"
                />
                <span>Landlord</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="TENANT"
                  checked={role === "TENANT"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-emerald-600"
                />
                <span>Tenant</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
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
            {pending ? "Registering..." : "Register"}
          </button>
          <p className="pt-1 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-600">Log in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
