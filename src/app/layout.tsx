import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/tanstack-query-provider";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export const metadata: Metadata = {
  title: "Zafar collage of health sciences",
  description: "Zafar collage of health sciences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, poppins.className)}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <TooltipProvider>
            {children}
            <Toaster
              position="bottom-right"
              closeButton
              expand
              richColors
            />
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
