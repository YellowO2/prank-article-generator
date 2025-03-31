"use client";

import { useState } from "react";

export default function CreatePrank() {
  const [formData, setFormData] = useState({
    headline: "",
    description: "",
    type: "news-article", // Default type
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  // const router = useRouter(); // Uncomment if you want to redirect later

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedLink(null);

    try {
      const response = await fetch("/api/create-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to parse error message from response body
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {
          // If body isn't JSON or empty, use the default message
          console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result.link) {
        setGeneratedLink(result.link);
        // Optionally clear the form or redirect
        // setFormData({ headline: "", description: "", type: "news-article" });
        // router.push(`/prank-created?link=${encodeURIComponent(result.link)}`); // Example redirect
      } else {
        throw new Error("API did not return a link.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to create prank:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to copy link
  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard
        .writeText(generatedLink)
        .then(() => {
          // Optional: Show a temporary "Copied!" message
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          alert("Failed to copy link.");
        });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Link</h1>

      {!generatedLink ? (
        // Show Form if no link is generated yet
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="fieldset">
            <legend className="px-2 font-medium text-lg mb-1">Headline</legend>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
              className="input input-bordered w-full focus:input-primary"
              placeholder="e.g., Giant Squirrel Spotted Downtown!"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-base-content/70 mt-2 px-2">
              Make it catchy and believable. This becomes part the link.
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="px-2 font-medium text-lg mb-1">
              Description (Optional)
            </legend>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="textarea textarea-bordered h-24 w-full focus:textarea-primary"
              rows={3}
              placeholder="Add a short blurb to hook your victims..."
              disabled={isLoading}
            />
            <p className="text-sm text-base-content/70 mt-2 px-2">
              A little extra detail can sell the prank.
            </p>
          </fieldset>

          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn w-full" // Changed to btn-primary for emphasis
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Generating...
              </>
            ) : (
              "Generate Prank Link"
            )}
          </button>
        </form>
      ) : (
        // Show Generated Link section
        <div className="text-center space-y-4 p-6 bg-base-200 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">Prank Link Generated!</h2>
          <p>Share this link with your unsuspecting friends:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-base-100 p-4 rounded-md">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="input input-bordered w-full sm:flex-grow text-center sm:text-left"
              onClick={(e) => (e.target as HTMLInputElement).select()} // Select text on click
            />
            <button
              onClick={copyToClipboard}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Copy Link
            </button>
          </div>
          <button
            onClick={() => {
              //   setGeneratedLink(null);
              //   // Optionally reset form fields if needed
              //   setFormData({
              //     headline: "",
              //     description: "",
              //     type: "news-article",
              //   });
            }}
            className="btn btn-ghost"
          >
            Create Another Prank
          </button>
        </div>
      )}
    </div>
  );
}
