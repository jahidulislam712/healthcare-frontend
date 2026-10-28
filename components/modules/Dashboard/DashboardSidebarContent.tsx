"use client";

import { UserInfo } from "@/app/types/auth.types";
import { NavSection } from "@/app/types/dashboard.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
            <div key={sectionId}>
              <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
              {sectionId < navItems.length - 1 && <Separator></Separator>}
            </div>
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
