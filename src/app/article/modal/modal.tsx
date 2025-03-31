"use client";

import { useState } from "react"; // Keep useState for showQRCode
import { QRCodeSVG } from "qrcode.react";

interface RickRollModalProps {
  isVisible: boolean; // Control visibility from parent
  onClose: () => void; // Function to call when closing
  viewCount: number; // Keep viewCount prop
}

export default function RickRollModal({
  isVisible,
  onClose,
  viewCount,
}: RickRollModalProps) {
  // Removed internal isVisible state and useEffect timer
  const [showQRCode, setShowQRCode] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Only render the modal if isVisible prop is true
  if (!isVisible) {
    return null;
  }

  return (
    // Use `modal-open` class conditionally based on isVisible prop,
    // although mounting/unmounting might be simpler as done above.
    // DaisyUI usually handles visibility with the class on a wrapper or checkbox.
    // Sticking with conditional rendering (if !isVisible return null) is often clearest in React.
    <div className="modal modal-open">
      {" "}
      {/* Keep modal-open since we only render when visible */}
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose} // Use the onClose prop to hide the modal
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">April Fools! 🎉</h2>
        <div className="mb-4">
          <div className="aspect-video">
            {/* IMPORTANT: Keep autoplay=1&mute=0. It should work now because */}
            {/* the modal is triggered by a direct user click. */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              className="w-full h-full"
              title="Rick Astley - Never Gonna Give You Up"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" // added web-share
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <p className="mb-4">
          This article's rick roll has {viewCount} views :)
        </p>
        {/* Share buttons and QR code logic remain the same */}
        <div className="flex items-center gap-4">
          {/* Native Share */}
          <button
            onClick={() =>
              navigator.share({
                title: "You got Rick Rolled!",
                text: "Check out this interesting article...",
                url: currentUrl,
              })
            }
            aria-label="Share via native"
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=Check%20this%20out!%20You%20got%20Rick%20Rolled!%20${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43 1s-2 .89-2.8 1.15a4.5 4.5 0 00-7.74 4.1A12.81 12.81 0 013 2s-4 9 5 13a13 13 0 01-8 2c9 5.5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12a10 10 0 10-11.5 9.95v-7.05h-2.37V12h2.37V9.79c0-2.35 1.38-3.65 3.5-3.65.94 0 1.92.17 1.92.17v2.11h-1.08c-1.07 0-1.4.66-1.4 1.33V12h2.38l-.38 2.9h-2V22A10 10 0 0022 12z" />
            </svg>
          </a>
          {/* Toggle QR Code */}
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            aria-label={showQRCode ? "Hide QR Code" : "Show QR Code"}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M8 3H5a2 2 0 00-2 2v3" />
              <polyline points="16 3 21 3 21 8" />
              <path d="M16 21h3a2 2 0 002-2v-3" />
              <polyline points="8 21 3 21 3 16" />
              <path d="M3 8V5a2 2 0 012-2h3" />
              <polyline points="21 16 21 21 16 21" />
            </svg>
          </button>
        </div>
        {showQRCode && currentUrl && (
          <div className="mt-4 flex justify-center">
            <QRCodeSVG value={currentUrl} size={128} />
          </div>
        )}
      </div>
      {/* Optional: Add a backdrop click handler if needed */}
      {/* <div className="modal-backdrop" onClick={onClose}></div> */}
    </div>
  );
}
