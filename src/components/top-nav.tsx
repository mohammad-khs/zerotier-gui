"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SquareTerminal, Users2Icon } from "lucide-react";
import { useSelectedNetwork } from "@/stores/store";
import { Button } from "./ui/button";

const getNetworkIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/network\/([^\/]+)/);
  return match ? match[1] : null;
};

export default function TopNav() {
  const pathname = usePathname();
  const { selectedNetworkId } = useSelectedNetwork();
  const currentNetworkId =
    getNetworkIdFromPath(pathname) ||
    (pathname === "/" ? selectedNetworkId : null);

  const items = [
    { title: "Network List", url: "/", icon: HomeIcon, enabled: true },
    {
      title: "Network Settings",
      url: currentNetworkId ? `/network/${currentNetworkId}/settings` : "/",
      icon: SquareTerminal,
      enabled: Boolean(currentNetworkId),
    },
    {
      title: "Network Members",
      url: currentNetworkId ? `/network/${currentNetworkId}/members` : "/",
      icon: Users2Icon,
      enabled: Boolean(currentNetworkId),
    },
  ];

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <nav className="flex items-center justify-center md:justify-start gap-2 md:gap-3 flex-wrap">
      {items.map((it) =>
        it.enabled ? (
          <Link key={it.title} href={it.url}>
            <Button
              variant={isActive(it.url) ? "default" : "ghost"}
              size={"sm"}
              className={`transition-all ${
                isActive(it.url)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground"
              }`}
              title={it.title}
            >
              <it.icon className="h-4 w-4" />
              <span className="hidden md:inline ml-2">{it.title}</span>
            </Button>
          </Link>
        ) : (
          <Button
            size={"sm"}
            variant={"ghost"}
            disabled={true}
            key={it.title}
            title={it.title}
            className="opacity-50 cursor-not-allowed"
          >
            <it.icon className="h-4 w-4" />
            <span className="hidden md:inline ml-2">{it.title}</span>
          </Button>
        ),
      )}
    </nav>
  );
}
