import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";

export default function DashboardLandingPage() {
  return (
    <MainLayout tickerMessage="Choose a role-based dashboard to continue.">
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Dashboard Access</h1>
        <p className="text-sm text-gray-600 mb-5">
          Select the portal that matches your role.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/user-dashboard"
            className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            Open User Dashboard
          </Link>
          <Link
            href="/admin-dashboard"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            Open Admin Dashboard
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
