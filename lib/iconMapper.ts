import * as Icons from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { createElement } from "react";

export const getIconComponent = (iconName: string): LucideIcon => {
  const IconCompoment = Icons[iconName as keyof typeof Icons];

  if (!IconCompoment) {
    return Icons.HelpCircle;
  }

  return IconCompoment as LucideIcon;
};

interface IconProps extends LucideProps {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  const IconComponent =
    (Icons[name as keyof typeof Icons] as LucideIcon) || Icons.HelpCircle;

  return createElement(IconComponent, props);
}
