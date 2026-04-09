"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
// Note: Adjust this import path if your useAuth hook is located elsewhere
import { useAuth } from "@/hooks/useAuth"; 
import { Menu, X, LogOut, ShieldCheck, Map, Activity, User, Home } from "lucide-react";

const staticNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "CCTV Registry", href: "/cctv-registry", icon: Map },
  { label: "Social Feed", href: "/social-feed", icon: Activity },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add a blur effect when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-blue-950/85 backdrop-blur-md border-blue-800/50 shadow-lg py-2"
          : "bg-blue-950 border-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">
            Sadak<span className="text-orange-400">Saathi</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {staticNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                  isActive 
                    ? "text-orange-400" 
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/user-dashboard"
                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-800/50 hover:bg-blue-800 border border-blue-700/50 px-4 py-2 rounded-lg transition-all"
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-200 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-blue-100 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-950 border-b border-blue-900 shadow-xl py-4 px-4 flex flex-col gap-4">
          {staticNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-blue-100 hover:text-white font-medium p-2 rounded-lg hover:bg-blue-900/50 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          
          <div className="h-px w-full bg-blue-800/50 my-2"></div>

          {!loading && (
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-800 py-3 rounded-lg"
                  >
                    <User size={18} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-red-400 bg-red-950/30 border border-red-900/50 py-3 rounded-lg"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold text-blue-100 border border-blue-800 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold text-white bg-orange-500 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}