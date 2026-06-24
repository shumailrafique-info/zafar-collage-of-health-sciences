"use client"

import { ErrorBanner, PasswordInput } from "@/components/auth/auth-forms";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

type signinSchemaValues = z.infer<typeof signinSchema>;

export default function SignInPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter()

  const form = useForm<signinSchemaValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const handleSubmit = async (data: signinSchemaValues) => {
    try {
      setPending(true);
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });
      if (res.error) {
        if (res.error.code === "EMAIL_NOT_VERIFIED") {
          return setError(
            "Email not verified. Please check your email inbox to verify your account."
          );
        }
        return setError(res.error.message ?? "");
      }
      if (res.data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
          Sign in
        </h2>
        <p className="text-sm text-ink-500">
          Welcome back. Enter your details to continue.
        </p>
      </div>
      <FormProvider {...form}>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <ErrorBanner message={error} />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel className="">
                  Work email
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="you@email.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-red-500 text-sm" />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel className="flex items-center justify-between">
                  Password

                  <Link
                    href="/forgot-password"
                    className="text-xs text-ink-500 hover:text-ink-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </FieldLabel>
                <PasswordInput
                  {...field}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-red-500 text-sm" />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </FormProvider>
      <p className="text-sm text-ink-500">
        New to Topular?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-ink-900 hover:underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
