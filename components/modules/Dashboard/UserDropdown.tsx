import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/_action";
import { UserInfo } from "@/app/types/auth.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Key, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function UserDropdown({ user }: { user: UserInfo }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={"outline"}
            size={"icon"}
            className="rounded-full"
          ></Button>
        }
      >
        <span className="text-sm font-semibold rounded-full overflow-hidden">
          {user.image ? (
            <Image src={user.image} height={36} width={36} alt={user.name} />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>

              <p className="text-xs text-muted-foreground">{user.email}</p>

              <p className="text-xs text-primary uppercase">
                {user.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link href={"/my-profile"} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={"/change-password"} className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logoutAction}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
