import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/top-nav";
import { ThemeProvider } from "@/hooks/theme-provider";
import { ModeToggler } from "@/components/mode-toggler";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginSignupFrame from "@/components/ui/login-signup-frame";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroTier GUI",
  description: "Modern web interface for ZeroTier network management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id && !!session?.user?.username;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="border-b p-2 sm:p-4 flex h-16 items-center justify-between gap-2 sm:gap-4 transition-[height,width] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {/* Logo Section */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight">
                    ZeroTier
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    GUI
                  </span>
                </div>
              </Link>
              <div className="w-full justify-evenly gap-2 sm:gap-6 min-w-0 flex-1">
                {isAuthenticated && <TopNav />}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <LoginSignupFrame session={session} />
                <ModeToggler />
              </div>
            </header>
            <div className="m-5">{children}</div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
