"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import SocialPostCard from "./SocialPostCard";
import type { SocialPost } from "./SocialPostCard";

function toStringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function toNumberValue(value: unknown): number {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function LoadingCards() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="h-48 w-full animate-pulse bg-gray-200" />
                    <div className="space-y-3 p-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function SocialFeed() {

    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const postsQuery = query(
            collection(db, "social_posts"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(
            postsQuery,
            (snapshot) => {
                const normalized = snapshot.docs.map((postDoc) => {
                    const data = postDoc.data();

                    return {
                        id: postDoc.id,
                        username: toStringValue(data.username),
                        caption: toStringValue(data.caption),
                        image: toStringValue(data.image),
                        platform: toStringValue(data.platform),
                        timestamp: toNumberValue(data.timestamp),
                        likes: toNumberValue(data.likes),
                        dislikes: toNumberValue(data.dislikes),
                    };
                });

                setPosts(normalized);
                setLoading(false);
                setError("");
            },
            (firestoreError) => {
                setError(firestoreError.message || "Unable to load social posts.");
                setLoading(false);
            }
        );

        return () => unsubscribe();

    }, []);

    if (loading) {
        return <LoadingCards />;
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
                No social posts available right now.
            </div>
        );
    }

    return (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
            ))}

        </div>

    )

}

export default SocialFeed;