"use client"

import { ErrorBanner } from "@/components/auth/auth-forms";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useCheckEmailExists } from "@/lib/tanstack-react-query/hooks/check-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address")
        .max(255, "Email is too long"),
});

type forgotPasswordSchemaValues = z.infer<typeof forgotPasswordSchema>;


export default function ForgotPasswordPage() {
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const { mutateAsync: checkEmailExists } = useCheckEmailExists();
    const [success, setSuccess] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const form = useForm<forgotPasswordSchemaValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });
    const handleSubmit = async (data: forgotPasswordSchemaValues) => {
        setError("")
        try {
            setPending(true);
            const result = await checkEmailExists(data.email);
            if (!result.exists) {
                return setError("No account found with this email address.");
            }
            await authClient.requestPasswordReset(
                {
                    ...data,
                    redirectTo: `${window.location.origin}/reset-password`,
                },
                {
                    onError: error => {
                        setError(
                            error.error.message || "Failed to send password reset email"
                        )
                    },
                    onSuccess: () => {
                        setSuccess(true);
                        setCooldown(120);

                        toast.success(
                            "Password reset link sent. Please check your email inbox."
                        );
                    },
                }
            )
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    setSuccess(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);
    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                    Forgot Password
                </h2>
                <p className="text-sm text-ink-500">
                    Reset your password and regain access to your account.
                </p>
            </div>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5"
                >
                    {success && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            Password reset link sent. Please check your inbox and spam folder.
                        </div>
                    )}
                    <ErrorBanner message={error} />
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-1.5">
                                <FieldLabel className="">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    disabled={success}
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
                    <Button type="submit" className="w-full" size="lg" disabled={pending || success}>
                        {pending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : success ? (
                            `Try again in ${Math.floor(cooldown / 60)}:${String(
                                cooldown % 60
                            ).padStart(2, "0")}`
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
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
