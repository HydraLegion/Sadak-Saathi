"use client";

import MainLayout from "@/components/layout/MainLayout";
import SocialFeed from "@/components/SocialFeed";

export default function SocialFeedPage() {
    return (
        <MainLayout tickerMessage="Live citizen reports from social media about potholes and road damage.">
            <div className="space-y-6 pb-4">
                <h1 className="text-3xl font-bold text-blue-900">
                    Social Feed
                </h1>

                <p className="max-w-3xl text-gray-600">
                    Real-time citizen posts about road conditions in India and Chhattisgarh, filtered for actionable updates on potholes and repairs.
                </p>

                <SocialFeed />
            </div>
        </MainLayout>
    );
}
