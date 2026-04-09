import type { ReactNode } from "react";
import Header from "@/components/ui/Header";
import Navbar from "@/components/ui/Navbar";
import Ticker from "@/components/ui/Ticker";
import Footer from "@/components/ui/Footer";
import PotholeChatbot from "@/components/PotholeChatbot"

interface MainLayoutProps {
  children: ReactNode;
  tickerMessage?: string;
}

export default function MainLayout({ children, tickerMessage }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <Navbar />
      <Ticker message={tickerMessage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
      <Footer />
      <PotholeChatbot />
    </div>
  );
}
