"use client";
import Loader from "@/components/ui/loader";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { session, isPending } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    useEffect(() => {
        if (!isPending && session?.user) {
            if (session?.user.role === "admin") {
                router.replace(redirect || "/dashboard");
            } else {
                router.replace(redirect || "/");
            }
        }
    }, [session, isPending, redirect, router]);

    if (isPending || session?.user) {
        return <Loader className="" />;
    }

    return (
        <>
            {children}
        </>
    );
}