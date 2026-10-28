import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { UserInfo } from "@/app/types/auth.types";
import { NavSection } from "@/app/types/dashboard.types";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

function DashboardNavbarContent({
  user,
  navItems,
  dashboardHome,
}: {
  user: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}) {
  return (
    <div className="flex h-16 w-full shrink-0 items-center gap-4 border-b bg-background px-4">
      {/* mobile menu trigger */}
      <Sheet>
        <SheetTrigger
          className="md:hidden"
          render={
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <DashboardSidebarContent
            user={user}
            navItems={navItems}
            dashboardHome={dashboardHome}
          />
        </SheetContent>
      </Sheet>

      {/* Search Component */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search..." className="pl-9 pr-4" />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
          {/* Notification */}
          <NotificationDropdown/>

          {/* User Dropdown  */}
          <UserDropdown user={user}/>
      </div>
    </div>
  );
}

export default DashboardNavbarContent;
