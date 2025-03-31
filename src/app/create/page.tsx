"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateRickRollPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual create page after 10 seconds
    const timeout = setTimeout(() => {
      router.push("/create-for-real");
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-center">
      <h1 className="text-3xl font-bold mb-4">April Fools!</h1>
      <p className="mb-4">
        You thought you could create something? Not so fast!
      </p>
      <div className="aspect-video w-full max-w-lg mb-4">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&enablejsapi=1"
          className="w-full h-full"
          title="Rick Astley - Never Gonna Give You Up"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Redirecting you to the actual create page in 10 seconds...
      </p>
      <a href="/create-for-real" className="btn btn-info">
        ok this time for real its the creation page
      </a>
    </div>
  );
}
