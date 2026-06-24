"use client"

import { ErrorBanner, PasswordInput } from "@/components/auth/auth-forms";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters").max(128),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type resetPasswordSchemaValues = z.infer<typeof resetPasswordSchema>;


export default function SignUpPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const router = useRouter()
    const form = useForm<resetPasswordSchemaValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });
    const handleSubmit = async (data: resetPasswordSchemaValues) => {
        setError("")
        try {
            setPending(true);
            if (token == null) return
            await authClient.resetPassword(
                {
                    newPassword: data.password,
                    token,
                },
                {
                    onError: error => {
                        setError(error.error.message || "Failed to reset password")
                    },
                    onSuccess: () => {
                        toast.success("Password updated successfully")
                        router.push("/sign-in")
                    },
                }
            )
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    };

    if (!token) {
        return (
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                    Invalid Reset Link
                </h2>
                <p className="text-sm text-ink-500">
                    This password reset link is missing or invalid.
                </p>
            </div>
        );
    }


    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                    Reset Password
                </h2>
                <p className="text-sm text-ink-500">
                    Enter a new password for your account.
                </p>
            </div>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5"
                >

                    <ErrorBanner message={error} />

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
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-1.5">
                                <FieldLabel>
                                    Confirm Password
                                </FieldLabel>
                                <PasswordInput
                                    {...field}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-red-500 text-sm"
                                    />
                                )}
                            </Field>
                        )}
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={pending}>
                        {pending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            </FormProvider>

            <p className="text-sm text-ink-500">
                Wanna go back to signin?{" "}
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
