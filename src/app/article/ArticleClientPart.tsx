// src/app/article/[slug]/ArticleClientPart.tsx OR src/components/ArticleClientPart.tsx
"use client"; // <--- Marks this as a Client Component

import { useState } from "react";
import styles from "../article/article.module.css"; // Assuming CSS module is in the same dir or adjust path
import RickRollModal from "./modal/modal"; // Adjust path to your modal component

interface ArticleClientPartProps {
  article: {
    headline: string;
    views: number; // Pass the view count down
    // Pass any other article fields needed for display if not derived from paragraphs
  };
  paragraphs: string[]; // Pass the processed paragraphs
}

export default function ArticleClientPart({
  article,
  paragraphs,
}: ArticleClientPartProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Determine how many paragraphs to show initially
  const initialParagraphsToShow = 3; // Adjust as needed
  const visibleParagraphs = paragraphs.slice(0, initialParagraphsToShow);
  const hasMoreContent = paragraphs.length > initialParagraphsToShow;

  const handleReadMoreClick = () => {
    // Trigger the modal!
    setIsModalVisible(true);
  };

  return (
    <>
      {/* Link tag can stay in the server component's layout or page, but fine here too */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;700&display=swap"
      />

      <article className={styles.articleContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>{article.headline}</h1>
          <div className={styles.metadata}>
            {/* Your metadata display - using passed 'article' data or static text */}
            <div className={styles.authorInfo}>
              <span>Anonymous Author</span>
            </div>
            <span>·</span>
            <span>{new Date().toLocaleDateString()}</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </header>

        {/* Container for partial content and fade */}
        <div className={`relative ${styles.content}`}>
          {" "}
          {/* Added relative positioning */}
          <div
            // Combine CSS module class with conditional Tailwind/utility classes
            className={`${styles.proseAdapt} ${
              hasMoreContent ? "max-h-60 overflow-hidden" : ""
            }`}
            // Use a generic class like proseAdapt in your CSS module or use Tailwind prose classes
            // Adjust max-h-XX (e.g., max-h-60, max-h-80) for desired preview height
          >
            {visibleParagraphs.map((paragraph, index) => (
              <p key={`vis-${index}`}>{paragraph}</p>
            ))}
          </div>
          {/* Fade effect overlay */}
          {hasMoreContent && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none dark:from-gray-900 dark:via-gray-900/90"></div>
          )}
        </div>

        {/* "Read Full Article" Button */}
        {hasMoreContent && (
          <div className="mt-6 text-center">
            <button
              onClick={handleReadMoreClick}
              // Use Tailwind or your CSS module class for styling
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              // Or className={styles.readMoreButton}
            >
              Read Full Article
            </button>
          </div>
        )}
      </article>

      {/* Render the modal conditionally - Pass viewCount from article prop */}
      <RickRollModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Pass the function to close the modal
        viewCount={article.views}
      />
    </>
  );
}

// Add a basic style in article.module.css if you don't have one for .proseAdapt
/*
.proseAdapt p {
  margin-bottom: 1em;
}
*/
