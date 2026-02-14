"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { forgotPassword } from "@/lib/auth-api";
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordPage() {
  const { push } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      setError(null);
      await forgotPassword(values);
      push({
        variant: "success",
        title: "Check your email",
        description: "If the account exists, a reset link has been sent.",
      });
      form.reset();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || "Request failed"
        : "Request failed";
      setError(message);
      push({
        variant: "error",
        title: "Request failed",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_45%,_#f8fafc_80%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-black p-8 text-white md:flex">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                Travel CRM
              </div>
              <h1 className="mt-6 text-3xl font-semibold leading-tight">
                Reset access in minutes.
              </h1>
              <p className="mt-3 text-sm text-white/70">
                We’ll email a secure link to update your password.
              </p>
            </div>
            <div className="text-xs text-white/50">
              Security first. We never reveal account status.
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Forgot password
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                Request a reset link
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter the email associated with your account.
              </p>
            </div>

            <Card className="border-slate-200">
              <CardContent className="space-y-5 p-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner className="text-white" size={14} />
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>

                <div className="text-center text-xs text-slate-500">
                  <Link
                    href="/login"
                    className="text-slate-900 underline-offset-4 hover:underline"
                  >
                    Back to login
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
