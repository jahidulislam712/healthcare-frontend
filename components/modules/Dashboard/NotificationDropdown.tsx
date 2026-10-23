"use client";

import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Clock1,
  MessageCircle,
  Shield,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "appointment"
    | "schedule"
    | "system"
    | "user"
    | "payment"
    | "reminder"
    | "message"
    | "security";
  timestamp: string;
  read: boolean;
}

function NotificationDropdown() {
  const MOCK_NOTIFICATIONS: Notification[] = [
    {
      id: "1",
      title: "New Appointment Scheduled",
      message:
        "You have a new appointment scheduled with John Doe on 2026-10-22 at 10:00 AM.",
      type: "appointment",
      timestamp: "2026-10-21T10:55:00.000Z",
      read: false,
    },
    {
      id: "2",
      title: "Schedule Updated",
      message:
        "Your schedule has been updated for the week of October 26, 2026.",
      type: "schedule",
      timestamp: "2026-10-21T09:25:00.000Z",
      read: true,
    },
    {
      id: "3",
      title: "System Maintenance",
      message:
        "The system will undergo maintenance on October 25, 2026, from 1:00 AM to 3:00 AM.",
      type: "system",
      timestamp: "2026-10-20T11:25:00.000Z",
      read: false,
    },
    {
      id: "4",
      title: "New User Registered",
      message: "A new user, Jane Smith, has registered on the platform.",
      type: "user",
      timestamp: "2026-10-19T11:25:00.000Z",
      read: true,
    },
    {
      id: "5",
      title: "Payment Received",
      message:
        "A payment of $150.00 has been received successfully for appointment #APT-1024.",
      type: "payment",
      timestamp: "2026-10-19T08:25:00.000Z",
      read: false,
    },
    {
      id: "6",
      title: "Appointment Reminder",
      message:
        "Reminder: You have an upcoming appointment with Michael Brown tomorrow at 11:30 AM.",
      type: "reminder",
      timestamp: "2026-10-18T11:25:00.000Z",
      read: false,
    },
    {
      id: "7",
      title: "New Message Received",
      message:
        "You have received a new message from David Miller regarding an upcoming appointment.",
      type: "message",
      timestamp: "2026-10-17T11:25:00.000Z",
      read: true,
    },
    {
      id: "8",
      title: "Password Changed",
      message:
        "Your account password was changed successfully. If you did not make this change, please secure your account.",
      type: "security",
      timestamp: "2026-10-16T11:25:00.000Z",
      read: false,
    },
  ];

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "schedule":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "system":
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case "user":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "message":
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case "reminder":
        return <Clock1 className="h-4 w-4 text-green-600" />;
      case "security":
        return <Shield className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((item) => !item.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <Bell />
          </Button>
        }
      />
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant={"secondary"} className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-75">
            {MOCK_NOTIFICATIONS.length > 0 ? (
              MOCK_NOTIFICATIONS.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium leading-none">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </ScrollArea>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-center justify-center cursor-pointer">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;
