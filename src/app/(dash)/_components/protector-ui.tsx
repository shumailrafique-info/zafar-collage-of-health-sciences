"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { ShieldX } from "lucide-react";
import Link from "next/link";
const ProtectorUi = () => {
    return (
        <div className="min-h-screen bg-ink-50 p-6 lg:p-8">
            <div className="max-w-md mx-auto mt-16 rounded-2xl border border-ink-100 bg-white p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <ShieldX className="w-6 h-6" />
                </div>
                <h1 className="mt-4 text-lg font-semibold text-ink-900">
                    Admin access only
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                    Your account isn&apos;t on the Elcure admin allowlist.
                </p>
                <Button asChild className="mt-5">
                    <Link href="/dashboard">Back to dashboard</Link>
                </Button>
                <Button
                    onClick={async () => {
                        await authClient.signOut()
                        window.location.reload()
                    }}
                    variant={"destructive"}
                    className="mt-5">
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default ProtectorUi
