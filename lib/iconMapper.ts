import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const getIconComponent = (iconName: string): LucideIcon => {
  const IconCompoment = Icons[iconName as keyof typeof Icons];

  if (!IconCompoment) {
    return Icons.HelpCircle;
  }

  return IconCompoment as LucideIcon;
};
