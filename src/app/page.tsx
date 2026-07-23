import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NetworkList from "../components/NetworkList";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  Zap,
  Users,
  Network,
  Server,
  CheckCircle,
  Github,
  Twitter,
  BookOpen,
} from "lucide-react";
import LoginSignupFrame from "@/components/ui/login-signup-frame";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let networkList: string[] = [];
  let fetchError: string | null = null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const isAuthenticated = session?.user?.id && session?.user?.username;

  if (isAuthenticated) {
    try {
      if (!baseUrl) {
        throw new Error("BASE_URL or NEXT_PUBLIC_BASE_URL is not defined");
      }
      const res = await fetch(`${baseUrl}/controller/network`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ZEROTIER_TOKEN}`,
        },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Failed to fetch network list (${res.status}): ${body}`,
        );
      }
      networkList = await res.json();
      console.log(networkList);
    } catch (error) {
      fetchError = error instanceof Error ? error.message : String(error);
      console.error("Failed to load network list:", fetchError);
    }
  }

  if (isAuthenticated) {
    return (
      <main className="space-y-10 px-4 sm:px-6 lg:px-8">
        {fetchError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p>Error loading networks: {fetchError}</p>
          </div>
        ) : (
          <NetworkList networkList={networkList} />
        )}
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Network className="h-4 w-4" />
              <span>ZeroTier Network Controller GUI</span>
            </div>

            <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Manage Your
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                Virtual Networks
              </span>{" "}
              with Ease
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A modern, intuitive web interface for managing ZeroTier networks.
              Create, configure, and monitor your virtual LANs in real-time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <LoginSignupFrame
                variant="default"
                size="lg"
                text="Get Started"
              />

              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://docs.zerotier.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Open Source</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">Zero</div>
                <div className="text-sm text-muted-foreground">
                  Configuration Required
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">
                  Network Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Manage Your Networks
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A comprehensive dashboard that puts you in control of your
              ZeroTier infrastructure
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ZeroTier */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose ZeroTier GUI?
              </h2>
              <p className="mb-6 text-muted-foreground">
                ZeroTier GUI provides a user-friendly interface for managing
                your virtual networks without the complexity of command-line
                tools.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 blur-2xl" />
                <div className="relative rounded-2xl border bg-card p-8 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Server className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-sm font-medium">
                        ZeroTier Controller
                      </div>
                      <div className="text-xs text-muted-foreground">
                        v1.12.0
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Networks</span>
                      <span className="font-medium">Active</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Nodes</span>
                      <span className="font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600">
                        ● Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16 lg:py-24 rounded-2xl mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get started with ZeroTier GUI in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2026 ZeroTier GUI. Built with ❤️ for the community.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://docs.zerotier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              <span className="sr-only">Documentation</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Data Arrays
const features = [
  {
    icon: Network,
    title: "Network Management",
    description:
      "Create, delete, and configure virtual networks with a simple click-based interface.",
  },
  {
    icon: Users,
    title: "Member Control",
    description:
      "Add or remove members, manage permissions, and monitor network activity in real-time.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Built-in authentication and authorization to keep your networks secure and private.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "See network changes and member status updates instantly with live monitoring.",
  },
  {
    icon: Globe,
    title: "Global Connectivity",
    description:
      "Connect devices across the world as if they were on the same local network.",
  },
  {
    icon: Server,
    title: "Self-Hosted",
    description:
      "Full control over your data with self-hosted deployment options.",
  },
];

const steps = [
  {
    title: "Sign In",
    description: "Authenticate with your ZeroTier account or credentials",
  },
  {
    title: "Create Network",
    description: "Set up a new virtual network with custom settings",
  },
  {
    title: "Add Members",
    description: "Invite devices and manage network access control",
  },
];

const benefits = [
  "User-friendly web interface for ZeroTier management",
  "Real-time network monitoring and status updates",
  "No command-line knowledge required",
  "Secure authentication and role-based access",
  "Open source and community-driven development",
  "Compatible with all ZeroTier features",
];
