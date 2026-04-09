'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  userRole?: 'user' | 'admin';
  userName?: string;
  userEmail?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function AppLayout({
  children,
  userRole = 'user',
  userName = 'Priya Sharma',
  userEmail = 'priya.sharma@municipal.gov.in',
  pageTitle,
  pageSubtitle,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar userRole={userRole} userName={userName} userEmail={userEmail} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar userRole={userRole} userName={userName} userEmail={userEmail} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border/60 bg-surface flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-text transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-600 text-sm text-text">PotholeAI</span>
          <button className="p-2 rounded-lg hover:bg-surface-elevated text-muted-foreground relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </header>

        {/* Desktop topbar */}
        <header className="hidden lg:flex items-center justify-between h-14 px-6 border-b border-border/60 bg-surface/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {pageTitle && (
              <div>
                <h1 className="text-base font-600 text-text leading-tight">{pageTitle}</h1>
                {pageSubtitle && (
                  <p className="text-xs text-muted-foreground">{pageSubtitle}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search potholes, reports…"
                className="input-field pl-8 w-56 h-8 text-xs"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-text transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border/60">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{userName.charAt(0)}</span>
              </div>
              <span className="text-xs font-500 text-text">{userName}</span>
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}