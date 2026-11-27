import {
  LayoutDashboard, ShieldCheck, Users, MessageSquare, CreditCard, ShoppingBag,
  Zap, FileText, Leaf, Settings,
} from 'lucide-react';

/** Single source of truth for admin navigation (both admin shells use it). */
export const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard/admin' },
  { icon: ShieldCheck,     label: 'KYC Queue',      href: '/dashboard/admin/kyc' },
  { icon: Users,           label: 'Users',          href: '/dashboard/admin/users' },
  { icon: ShoppingBag,     label: 'Orders',         href: '/dashboard/admin/orders' },
  { icon: CreditCard,      label: 'Transactions',   href: '/dashboard/admin/transactions' },
  { icon: MessageSquare,   label: 'Moderation',     href: '/dashboard/admin/moderation' },
  { icon: Leaf,            label: 'Schemes',        href: '/dashboard/admin/schemes' },
  { icon: Zap,             label: 'Broadcast',      href: '/dashboard/admin/broadcast' },
  { icon: FileText,        label: 'Audit Trail',    href: '/dashboard/admin/audit' },
  { icon: Settings,        label: 'System Config',  href: '/dashboard/admin/config' },
] as const;


export const isAdminNavActive = (pathname: string, href: string) =>
  pathname === href || (href !== '/dashboard/admin' && pathname.startsWith(href));
