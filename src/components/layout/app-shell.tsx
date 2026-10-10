"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  LogOut,
  Menu,
  User as UserIcon,
  ExternalLink,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ROLE_GRADIENT: Record<string, string> = {
  ADMIN: "from-rose-500 to-orange-500",
  COMPANY: "from-blue-500 to-indigo-600",
  CANDIDATE: "from-emerald-500 to-teal-600",
};

export function AppShell({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const gradient = ROLE_GRADIENT[user?.role ?? "CANDIDATE"];

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm", gradient)}>
          <Code2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight">DevAssess</span>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Assessment Platform</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? cn("bg-gradient-to-r text-white shadow-sm", gradient)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !active && "group-hover:scale-110")} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* User card at bottom of sidebar */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
            <AvatarFallback className={cn("text-[10px] text-white bg-gradient-to-br", gradient)}>
              {getInitials(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user?.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-background/95 backdrop-blur md:flex md:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6">
          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Page title breadcrumb — desktop */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br", gradient)}>
              <Code2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">DevAssess</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground capitalize">
              {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Dashboard"}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Role badge */}
            {user?.role && (
              <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                {user.role}
              </Badge>
            )}

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
                    <AvatarFallback className={cn("text-xs text-white bg-gradient-to-br", gradient)}>
                      {getInitials(user?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in-0 zoom-in-95">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="font-normal text-xs text-muted-foreground">{user?.email}</span>
                    {user?.role && <RoleBadge role={user.role} />}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="h-4 w-4 mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Back to site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
