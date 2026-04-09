'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Upload,
  MapPin,
  FileText,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertTriangle,
  Bell,
  User,
  Map,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  badge?: number;
  section?: string;
}

const userNavItems: NavItem[] = [
  { label: 'My Dashboard', icon: LayoutDashboard, href: '/user-dashboard', section: 'main' },
  { label: 'Upload Video', icon: Upload, href: '/user-dashboard', section: 'main' },
  { label: 'My Potholes', icon: MapPin, href: '/user-dashboard', section: 'main', badge: 3 },
  { label: 'Complaints', icon: FileText, href: '/user-dashboard', section: 'main', badge: 2 },
  { label: 'Map View', icon: Map, href: '/user-dashboard', section: 'main' },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin Overview', icon: LayoutDashboard, href: '/admin-dashboard', section: 'admin' },
  { label: 'All Reports', icon: ShieldCheck, href: '/admin-dashboard', section: 'admin', badge: 12 },
  { label: 'Analytics', icon: BarChart3, href: '/admin-dashboard', section: 'admin' },
  { label: 'Risk Map', icon: Map, href: '/admin-dashboard', section: 'admin' },
  { label: 'Departments', icon: AlertTriangle, href: '/admin-dashboard', section: 'admin' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Notifications', icon: Bell, href: '/user-dashboard', badge: 5 },
  { label: 'Profile', icon: User, href: '/user-dashboard' },
  { label: 'Settings', icon: Settings, href: '/user-dashboard' },
];

interface SidebarProps {
  userRole?: 'user' | 'admin';
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({
  userRole = 'user',
  userName = 'Priya Sharma',
  userEmail = 'priya.sharma@municipal.gov.in',
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const primaryNavItems = userRole === 'admin' ? adminNavItems : userNavItems;

  const isActive = (href: string) => pathname === href;

  const handleNav = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen
        bg-surface border-r border-border/60
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
        flex-shrink-0
      `}
    >
      {/* Logo area */}
      <div className={`flex items-center h-16 px-3 border-b border-border/60 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display font-700 text-sm text-text leading-tight block truncate">
                PotholeAI
              </span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                {userRole === 'admin' ? 'Admin Portal' : 'Field Worker'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-10 flex items-center justify-center w-6 h-6 rounded-full bg-surface-elevated border border-border text-muted-foreground hover:text-text hover:border-primary/50 transition-all duration-150"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        {/* Section label */}
        {!collapsed && (
          <p className="stat-label px-2 mb-2">
            {userRole === 'admin' ? 'Administration' : 'Workspace'}
          </p>
        )}

        <ul className="space-y-0.5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNav(item.href)}
                  className={`nav-item w-full text-left ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                  data-tooltip={collapsed ? item.label : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0 relative">
                    <Icon size={18} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-primary text-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </span>
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className="ml-auto flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Cross-role quick links */}
        {!collapsed && (
          <div className="mt-6">
            <p className="stat-label px-2 mb-2">Quick Access</p>
            <ul className="space-y-0.5">
              {userRole === 'user' ? (
                <li>
                  <button
                    onClick={() => handleNav('/admin-dashboard')}
                    className="nav-item w-full text-left"
                  >
                    <ShieldCheck size={18} />
                    <span className="truncate">Admin Panel</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => handleNav('/user-dashboard')}
                    className="nav-item w-full text-left"
                  >
                    <LayoutDashboard size={18} />
                    <span className="truncate">User View</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom section: profile + bottom nav */}
      <div className="border-t border-border/60 py-3 px-2 space-y-0.5">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`nav-item w-full text-left ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0 relative">
                <Icon size={18} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-destructive text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* User profile */}
        <div className={`mt-2 pt-2 border-t border-border/40 ${collapsed ? 'flex justify-center' : 'flex items-center gap-2 px-2 py-1.5'}`}>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {userName.charAt(0)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-text truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
          {!collapsed && (
            <button
              className="flex-shrink-0 p-1 rounded hover:bg-surface-elevated text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}