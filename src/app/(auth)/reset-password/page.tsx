"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";
import { resetPassword } from "@/lib/auth-api";
import Link from "next/link";
import axios from "axios";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const { push } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      const message = "Reset token is missing.";
      setError(message);
      push({
        variant: "error",
        title: "Invalid link",
        description: message,
      });
      return;
    }

    try {
      setError(null);
      await resetPassword({
        token,
        newPassword: values.password,
      });
      push({
        variant: "success",
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || "Reset failed"
        : "Reset failed";
      setError(message);
      push({
        variant: "error",
        title: "Reset failed",
        description: message,
      });
    }
  };

  const onInvalid = () => {
    const message =
      form.formState.errors.password?.message ||
      form.formState.errors.confirmPassword?.message ||
      "Please fix the highlighted form errors.";

    push({
      variant: "error",
      title: "Validation failed",
      description: String(message),
    });
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
                Set a new password.
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Choose a strong password to protect your workspace.
              </p>
            </div>
            <div className="text-xs text-white/50">
              Your reset link expires in 15 minutes.
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Reset password
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                Create a new password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Make sure it’s at least 6 characters.
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
                      New password
                    </label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...form.register("password")}
                    />
                    <p className="text-xs text-red-500">
                      {form.formState.errors.password?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Confirm password
                    </label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...form.register("confirmPassword")}
                    />
                    <p className="text-xs text-red-500">
                      {form.formState.errors.confirmPassword?.message}
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
                        Updating...
                      </>
                    ) : (
                      "Update password"
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
