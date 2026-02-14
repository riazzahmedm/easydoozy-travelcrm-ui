"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "./schema";
import { login, getMe } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { push } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);

      await login(data); // cookie is set by backend

      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      const me = await getMe();
      push({
        variant: "success",
        title: "Welcome back",
        description: "You are now signed in.",
      });

      // 🔁 Redirect by role
      if (me.role === "SUPER_ADMIN") {
        router.push("/platform-dashboard");
      } else {
        router.push("/tenant-dashboard");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || "Login failed"
        : "Login failed";
      setError(message);
      push({
        variant: "error",
        title: "Login failed",
        description: message,
      });
    }
  };

  const onInvalid = () => {
    const message =
      form.formState.errors.email?.message ||
      form.formState.errors.password?.message ||
      "Please fix the highlighted form errors.";

    push({
      variant: "error",
      title: "Validation failed",
      description: String(message),
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_45%,_#f8fafc_80%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-black p-8 text-white md:flex">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                Travel CRM
              </div>
              <h1 className="mt-6 text-3xl font-semibold leading-tight">
                Organize every trip in one workspace.
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Manage plans, agents, and destinations with a fast
                tenant-ready CRM.
              </p>
            </div>

            <div className="text-xs text-white/50">
              Secure login powered by cookie-based auth.
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Welcome back
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                Sign in to Travel CRM
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Use your admin or agent credentials to continue.
              </p>
            </div>

            <Card className="border-slate-200">
              <CardContent className="space-y-5 p-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                  className="space-y-5"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email address
                    </label>
                    <Input
                      placeholder="you@company.com"
                      autoComplete="email"
                      {...form.register("email")}
                    />
                    <p className="text-xs text-red-500">
                      {form.formState.errors.email?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-900"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="text-xs text-red-500">
                      {form.formState.errors.password?.message}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner className="text-white" size={14} />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                <div className="text-center text-xs text-slate-500">
                  <Link
                    href="/forgot-password"
                    className="text-slate-900 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
