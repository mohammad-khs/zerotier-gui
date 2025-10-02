"use client";

import * as React from "react";
import {
  BookOpen,
  HomeIcon,
  Settings2,
  SquareTerminal,
  Users2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectedNetwork } from "@/stores/store";

// Extract network ID from current path
const getNetworkIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/network\/([^\/]+)/);
  return match ? match[1] : null;
};

// Generate navigation data based on current network
const getNavData = (currentNetworkId: string | null) => {
  const baseNavItems = [
    {
      title: "Network List",
      url: "/",
      icon: HomeIcon,
      isActive: true,
    },
  ];

  if (currentNetworkId) {
    baseNavItems.push(
      {
        title: "Network Settings",
        url: `/network/${currentNetworkId}/settings`,
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Network Members",
        url: `/network/${currentNetworkId}/members`,
        icon: Users2Icon,
        isActive: true,
      }
    );
  } else {
    baseNavItems.push(
      {
        title: "Network Settings",
        url: `/`,
        icon: SquareTerminal,
        isActive: false,
      },
      {
        title: "Network Members",
        url: `/`,
        icon: Users2Icon,
        isActive: false,
      }
    );
  }

  baseNavItems.push(
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: false,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
    }
  );

  return {
    navMain: baseNavItems,
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { selectedNetworkId } = useSelectedNetwork();
  const currentNetworkId =
    getNetworkIdFromPath(pathname) ||
    (pathname === "/" ? selectedNetworkId : null);
  const data = getNavData(currentNetworkId);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {currentNetworkId ? (
              <div className="flex flex-col">
                <span>Network</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {currentNetworkId.slice(0, 8)}...
                </span>
              </div>
            ) : (
              "Application"
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    disabled={!item.isActive}
                    variant={item.isActive ? "default" : "disabled"}
                    asChild
                    isActive={item.isActive}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {currentNetworkId && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2 py-1 text-xs text-muted-foreground">
                🔍 DEBUG: Using network {currentNetworkId}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
