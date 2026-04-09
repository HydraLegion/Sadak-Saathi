"use client";

import { useState } from "react";
import { doc, increment, updateDoc } from "firebase/firestore";
import { Calendar, ThumbsDown, ThumbsUp } from "lucide-react";
import { db } from "@/lib/firebaseClient";

export interface SocialPost {
    id: string;
    username: string;
    caption: string;
    image: string;
    platform: string;
    timestamp: number;
    likes: number;
    dislikes: number;
}

interface SocialPostCardProps {
    post: SocialPost;
}

function getPlatformBadgeClass(platform: string): string {
    const normalized = platform.toLowerCase();

    if (normalized.includes("instagram")) {
        return "bg-pink-100 text-pink-700 border-pink-200";
    }

    if (normalized.includes("twitter") || normalized.includes("x")) {
        return "bg-blue-100 text-blue-700 border-blue-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
}

function formatTimeAgo(timestamp: number): string {
    if (!timestamp) {
        return "Just now";
    }

    const now = Date.now();
    const diff = Math.max(0, now - timestamp);

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
        return "Just now";
    }

    if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(diff / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
}

export default function SocialPostCard({ post }: SocialPostCardProps) {
    const [likes, setLikes] = useState(post.likes ?? 0);
    const [dislikes, setDislikes] = useState(post.dislikes ?? 0);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleReaction = async (field: "likes" | "dislikes") => {
        if (isUpdating) {
            return;
        }

        setIsUpdating(true);

        if (field === "likes") {
            setLikes((currentLikes) => currentLikes + 1);
        } else {
            setDislikes((currentDislikes) => currentDislikes + 1);
        }

        try {
            const postRef = doc(db, "social_posts", post.id);
            await updateDoc(postRef, {
                [field]: increment(1),
            });
        } catch {
            if (field === "likes") {
                setLikes((currentLikes) => Math.max(0, currentLikes - 1));
            } else {
                setDislikes((currentDislikes) => Math.max(0, currentDislikes - 1));
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="h-48 w-full overflow-hidden bg-gray-100">
                <img
                    src={post.image || "/assets/images/placeholder.png"}
                    alt={post.caption || "Social post image"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-blue-900">
                        {post.username || "@anonymous"}
                    </p>
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPlatformBadgeClass(
                            post.platform || ""
                        )}`}
                    >
                        {post.platform || "Unknown"}
                    </span>
                </div>

                <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} />
                    {formatTimeAgo(post.timestamp)}
                </p>

                <p className="text-sm leading-relaxed text-gray-700">
                    {post.caption}
                </p>

                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => void handleReaction("likes")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ThumbsUp size={14} />
                        <span>Like ({likes})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => void handleReaction("dislikes")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ThumbsDown size={14} />
                        <span>Dislike ({dislikes})</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
