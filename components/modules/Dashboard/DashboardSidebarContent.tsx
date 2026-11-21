"use client";

import { UserInfo } from "@/app/types/auth.types";
import { NavSection } from "@/app/types/dashboard.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "cn";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement, useState } from "react";

function hasActiveItem(
  items: NavSection["items"],
  pathname: string,
): boolean {
  return items.some(
    (item) =>
      item.href === pathname ||
      (item.items ? hasActiveItem(item.items, pathname) : false),
  );
}

function SidebarNavItem({
  item,
  pathname,
}: {
  item: NavSection["items"][number];
  pathname: string;
}) {
  const children = item.items ?? [];
  const hasChildren = children.length > 0;
  const isActive = item.href === pathname;
  const hasActiveChild = hasActiveItem(children, pathname);
  const [manualOpen, setManualOpen] = useState<{
    pathname: string;
    open: boolean;
  } | null>(null);
  const open =
    manualOpen?.pathname === pathname ? manualOpen.open : hasActiveChild;
  const setOpen = (nextOpen: boolean) =>
    setManualOpen({ pathname, open: nextOpen });
  const icon = item.icon
    ? createElement(getIconComponent(item.icon), {
        className: "h-4 w-4 shrink-0",
      })
    : null;

  return (
    <div>
      {hasChildren ? (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <div className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {icon}
                <span>{item.title}</span>
              </Link>
            ) : (
              <Collapsible.Trigger className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <span className="flex min-w-0 items-center gap-3">
                  {icon}
                  <span>{item.title}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    open && "rotate-180",
                  )}
                />
              </Collapsible.Trigger>
            )}
            {item.href && (
              <Collapsible.Trigger
                aria-label={`Toggle ${item.title} submenu`}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    open && "rotate-180",
                  )}
                />
              </Collapsible.Trigger>
            )}
          </div>
          <Collapsible.Panel>
            <div className="ml-3 space-y-1 border-l pl-3">
              {children.map((child, id) => (
                <SidebarNavItem
                  key={`${child.title}-${id}`}
                  item={child}
                  pathname={pathname}
                />
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      ) : item.href ? (
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {icon}
          <span>{item.title}</span>
        </Link>
      ) : (
        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">
          {icon}
          <span>{item.title}</span>
        </span>
      )}
    </div>
  );
}

function SidebarSection({
  section,
  pathname,
  showSeparator,
}: {
  section: NavSection;
  pathname: string;
  showSeparator: boolean;
}) {
  return (
    <div>
      <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {section.title}
      </h4>
      <div className="space-y-1">
        {section.items.map((item, id) => (
          <SidebarNavItem
            key={`${item.title}-${id}`}
            item={item}
            pathname={pathname}
          />
        ))}
      </div>
      {showSeparator && <Separator />}
    </div>
  );
}

function DashboardSidebarContent({
  user,
  navItems,
  dashboardHome,
}: {
  user: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo / Brand */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">HealthCare</span>
        </Link>
      </div>

      {/* Side Navigation */}
      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <nav className="space-y-4">
          {navItems.map((section, sectionId) => (
            <SidebarSection
              key={sectionId}
              section={section}
              pathname={pathname}
              showSeparator={sectionId < navItems.length - 1}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="shrink-0 border-t px-3 py-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={32}
                  width={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {user.role.toLowerCase().replaceAll("_", " ")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DashboardSidebarContent;
