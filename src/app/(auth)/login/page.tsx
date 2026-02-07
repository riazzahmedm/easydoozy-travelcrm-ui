"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "./schema";
import { login, getMe } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);

      await login(data); // cookie is set by backend

      const me = await getMe();

      // 🔁 Redirect by role
      if (me.role === "SUPER_ADMIN") {
        router.push("/plans");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Input
                placeholder="Email"
                {...form.register("email")}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.password?.message}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Signing in..."
                : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a
              href="/forgot-password"
              className="text-primary underline"
            >
              Forgot password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
