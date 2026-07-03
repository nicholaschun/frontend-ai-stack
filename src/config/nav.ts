import type { Route } from "next";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

import { env } from "@/config/env";

export const siteConfig = {
  name: "Keystone",
  tagline: "The load-bearing start for your next product.",
  description:
    "A production-grade Next.js starter: typed end to end, feature-sliced, and designed to scale one folder at a time.",
  url: env.NEXT_PUBLIC_APP_URL,
} as const;

export type NavItem = {
  title: string;
  icon: LucideIcon;
  /** Present only for routes that exist today (kept honest by typedRoutes). */
  href?: Route;
  /** Not built yet — rendered as a disabled item with a "soon" marker. */
  soon?: boolean;
};

/** Primary application navigation. Only Dashboard is wired in the skeleton. */
export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Team", icon: Users, soon: true },
  { title: "Billing", icon: CreditCard, soon: true },
  { title: "Settings", icon: Settings, soon: true },
];
