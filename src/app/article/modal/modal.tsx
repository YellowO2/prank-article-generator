"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface RickRollModalProps {
  isVisible: boolean;
  onClose: () => void;
  viewCount: number;
}

const FAKE_CAPTCHA_DURATION = 1800;

export default function RickRollModal({
  isVisible,
  onClose,
  viewCount,
}: RickRollModalProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  // States to manage the phases: captcha -> video loading -> video visible
  const [showFakeCaptcha, setShowFakeCaptcha] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const captchaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Effect to reset states and start captcha timer when modal opens
  useEffect(() => {
    if (isVisible) {
      setShowFakeCaptcha(true);
      setIsVideoLoading(true); // Assume video needs loading initially

      if (captchaTimeoutRef.current) clearTimeout(captchaTimeoutRef.current);

      captchaTimeoutRef.current = setTimeout(() => {
        setShowFakeCaptcha(false); // Captcha phase ends
        captchaTimeoutRef.current = null;
        // We don't set isVideoLoading here; the iframe's onLoad does that
      }, FAKE_CAPTCHA_DURATION);
    } else {
      // Reset everything when modal hides
      setShowFakeCaptcha(true);
      setIsVideoLoading(true);
      if (captchaTimeoutRef.current) {
        clearTimeout(captchaTimeoutRef.current);
        captchaTimeoutRef.current = null;
      }
      setShowQRCode(false);
    }

    return () => {
      // Cleanup on unmount
      if (captchaTimeoutRef.current) clearTimeout(captchaTimeoutRef.current);
    };
  }, [isVisible]);

  // Handler for iframe load event (fired only once per iframe mount)
  const handleIframeLoad = () => {
    setIsVideoLoading(false);
  };

  // Handler for closing the modal
  const handleClose = () => {
    if (captchaTimeoutRef.current) {
      clearTimeout(captchaTimeoutRef.current);
      captchaTimeoutRef.current = null;
    }
    onClose();
  };

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  // Determine if the video should be visually revealed
  // Reveal only after captcha AND after the iframe has loaded
  const shouldRevealVideo = !showFakeCaptcha && !isVideoLoading;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        {/* --- Close Button (Always visible, highest layer) --- */}
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2 z-30"
          onClick={handleClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* --- Captcha Overlay (Conditionally visible on top) --- */}
        {showFakeCaptcha && (
          <div className="absolute inset-0 bg-base-100 flex flex-col items-center justify-center z-20 rounded-lg">
            {" "}
            {/* Use absolute positioning and bg color */}
            <h2 className="text-xl font-semibold mb-4">Verifying Request...</h2>
            <span className="loading loading-dots loading-lg text-info"></span>
            <p className="text-sm text-base-content/70 mt-4">
              Performing security checks.
            </p>
          </div>
        )}

        {/* --- Main Content Area (Visible after captcha) --- */}
        {/* This structure holds the title/text/buttons shown AFTER captcha */}
        {/* Use opacity to fade it in smoothly AFTER captcha is done */}
        <div
          className={`transition-opacity duration-300 ${
            showFakeCaptcha ? "opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">April Fools :)</h2>
          <div className="mb-4">
            <div className="aspect-video">
              {/* Ensure container fills the space */}
              {/* Loading Spinner (Shows between captcha end and video load) */}
              {!showFakeCaptcha && isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="loading loading-spinner loading-lg text-white"></span>
                </div>
              )}
              {/* THE ONLY IFRAME INSTANCE */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&enablejsapi=1"
                className="w-full h-full"
                title="Rick Astley - Never Gonna Give You Up"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={handleIframeLoad} // Treat error as loaded
              ></iframe>
            </div>
          </div>

          <p className="mb-4">
            This article's rick roll has {viewCount} views :)
          </p>
          {/* Share buttons and QR code logic */}
          {/* Share buttons and QR code logic remain the same */}
          <div className="flex flex-wrap items-center gap-4">
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
            {/* <button
              className="btn btn-outline"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              {showQRCode ? "Hide QR Code" : "Show QR Code"}
            </button> */}
            <a className="btn btn-info" href="/create">
              Create your own link
            </a>
          </div>
          {showQRCode && currentUrl && (
            <div
              className="mt-4 flex justify-center"
              style={{ zIndex: 10, pointerEvents: "none" }}
            >
              <QRCodeSVG
                value={currentUrl}
                size={128}
                style={{ pointerEvents: "auto" }}
              />
            </div>
          )}
        </div>

        {/* --- THE SINGLE IFRAME + its Container --- */}
        <div
          className="absolute top-20 left-6 right-6 bottom-[calc(6rem+var(--padding-modal-y,1.5rem))]"
          style={{ pointerEvents: "none" }}
        >
          {/* Use top/left/right/bottom matching modal padding and accounting for header/footer height */}
        </div>

        {/* REMOVED the second conditionally rendered iframe */}
      </div>
    </div>
  );
}
