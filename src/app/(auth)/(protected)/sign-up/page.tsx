"use client"

import { ErrorBanner, PasswordInput } from "@/components/auth/auth-forms";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useCheckEmailExists } from "@/lib/tanstack-react-query/hooks/check-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(150, "Name is too long"),
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

type signupSchemaValues = z.infer<typeof signupSchema>;


export default function SignUpPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { mutateAsync: checkEmailExists } = useCheckEmailExists();
  const router = useRouter()

  const form = useForm<signupSchemaValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const handleSubmit = async (data: signupSchemaValues) => {
    setError("")
    try {
      setPending(true);
      const result = await checkEmailExists(data.email);
      if (result.exists) {
        return setError("Email already exists");
      }
      const { ...credentials } = data;
      const res = await authClient.signUp.email({
        ...credentials,
        role: "user",
      });
      if (res.error) {
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
          Create account
        </h2>
        <p className="text-sm text-ink-500">
          Start analyzing properties in seconds.
        </p>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <ErrorBanner message={error} />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel className="">
                  Full name
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-red-500 text-sm" />
                )}
              </Field>
            )}
          />
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
                <FieldLabel className="">
                  Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-red-500 text-sm" />
                )}
              </Field>
            )}
          />


          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign up"}
          </Button>

          <p className="text-xs text-ink-400 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="#" className="text-ink-600 hover:text-ink-900 underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-ink-600 hover:text-ink-900 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </FormProvider>

      <p className="text-sm text-ink-500">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-ink-900 hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
