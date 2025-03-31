"use client";
import { useState, useEffect } from "react";
import styles from "../article/article.module.css";
import RickRollModal from "./modal/modal";

interface ArticleClientPartProps {
  article: {
    headline: string;
    views: number;
    description: string; // Use this for subheading if available
    type?: string; // Could be used for category tag
    category: string; // Category for the article
  };
  paragraphs: string[];
}

export default function ArticleClientPart({
  article,
  paragraphs,
}: ArticleClientPartProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [featureImage, setFeatureImage] = useState(
    "https://unsplash.com/photos/white-clouds-3OIya0SQr3M"
  );
  const initialParagraphsToShow = 3;
  const visibleParagraphs = paragraphs.slice(0, initialParagraphsToShow);
  const hasMoreContent = true;

  // Generate a category based on article headline or type
  const getCategory = () => {
    if (article.category) return article.category.toUpperCase();

    // Detect common categories from headline
    const headline = article.headline.toLowerCase();
    if (
      headline.includes("food") ||
      headline.includes("restaurant") ||
      headline.includes("meal") ||
      headline.includes("mcdonald")
    )
      return "FOOD & DINING";
    if (
      headline.includes("tech") ||
      headline.includes("app") ||
      headline.includes("device")
    )
      return "TECHNOLOGY";
    if (
      headline.includes("university") ||
      headline.includes("student") ||
      headline.includes("campus") ||
      headline.includes("ntu")
    )
      return "EDUCATION";
    return "BREAKING NEWS";
  };

  // Generate dynamic subheading if none provided
  const getSubheading = () => {
    if (article.description) return article.description;

    // Extract keywords from headline for generic subheading
    const headline = article.headline.toLowerCase();
    if (headline.includes("free")) {
      return "Limited time offer has students excited across Singapore";
    } else if (headline.includes("new")) {
      return "Innovative announcement surprises Singapore residents";
    } else {
      return "The announcement has generated significant buzz on social media";
    }
  };

  // Get appropriate feature image based on content
  useEffect(() => {
    const category = article.category.toLowerCase();
    let imageUrl = "";

    // Map categories to images
    switch (category) {
      case "food":
        imageUrl =
          "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg"; // Food photography
        break;
      case "technology":
        imageUrl =
          "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Technology workspace
        break;
      case "education":
        imageUrl =
          "https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Students in a library
        break;
      case "lifestyle":
        imageUrl =
          "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Lifestyle reading moment
        break;
      case "business":
        imageUrl =
          "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Business meeting
        break;
      case "entertainment":
        imageUrl =
          "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Entertainment event
        break;
      case "travel":
        imageUrl =
          "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Scenic travel destination
        break;
      default:
        imageUrl =
          "https://images.pexels.com/photos/7195851/pexels-photo-7195851.jpeg?auto=compress&cs=tinysrgb&w=1200"; // Default scenic view
    }

    setFeatureImage(imageUrl);
  }, [article.category]);

  // Generate a realistic publication date
  const publicationDate = new Date();
  const formattedDate = publicationDate.toLocaleDateString("en-SG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generate a realistic author name instead of "Anonymous"
  const getAuthorName = () => {
    const commonNames = [
      "Sarah Tan",
      "Michael Wong",
      "Priya Singh",
      "David Lim",
      "Jessica Chen",
      "Ahmad Ibrahim",
      "Li Wei",
      "Fatimah Binte Zainudin",
    ];
    // Create a deterministic but seemingly random selection based on headline
    const nameIndex = article.headline.length % commonNames.length;
    return commonNames[nameIndex];
  };

  // Generate appropriate title for author based on content
  const getAuthorTitle = () => {
    const category = getCategory();
    if (category === "FOOD & DINING") return "Food & Lifestyle Reporter";
    if (category === "TECHNOLOGY") return "Tech Correspondent";
    if (category === "EDUCATION") return "Education Reporter";
    return "Staff Reporter";
  };

  // Extract a quote from content if possible
  const extractQuote = () => {
    for (const paragraph of paragraphs) {
      const quoteMatch = paragraph.match(/"([^"]+)"/);
      if (quoteMatch && quoteMatch[1].length > 30) {
        return quoteMatch[1];
      }
    }
    // Generate generic quote if none found
    return "This special announcement comes at a perfect time for our customers";
  };

  const handleReadMoreClick = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap"
      />

      <article className={styles.articleContainer}>
        {/* News site header */}
        <div className={styles.siteHeader}>
          <div className={styles.logo}>
            <span className={styles.newsSiteName}>Live News</span>
          </div>
          <div className={styles.siteNavbar}>
            <span>Home</span>
            <span>Business</span>
            <span>Food</span>
            <span>Lifestyle</span>
          </div>
        </div>

        {/* Dynamic category tag */}
        <div className={styles.categoryTag}>{getCategory()}</div>

        <header className={styles.header}>
          <h1 className={styles.title}>{article.headline}</h1>

          {/* Dynamic subheading */}
          <h2 className={styles.subheading}>{getSubheading()}</h2>

          <div className={styles.metadata}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {/* Use online avatar service for dynamic yet consistent author images */}
                <img
                  src={`https://ui-avatars.com/api/?name=${getAuthorName().replace(
                    " ",
                    "+"
                  )}&background=random`}
                  alt="Author"
                  className={styles.avatarImg}
                />
              </div>
              <div className={styles.authorDetails}>
                <span className={styles.authorName}>By {getAuthorName()}</span>
                <span className={styles.authorTitle}>{getAuthorTitle()}</span>
              </div>
            </div>
            <div className={styles.articleInfo}>
              <span>{formattedDate}</span>
              <span className={styles.dot}>•</span>
              <span>Updated 2 hours ago</span>
              <span className={styles.dot}>•</span>
              <span>3 min read</span>
            </div>
          </div>

          {/* Social sharing icons */}
          <div className={styles.socialShare}>
            <div className={styles.shareButton}>Share</div>
            <div className={styles.shareIcon}>f</div>
            <div className={styles.shareIcon}>t</div>
            <div className={styles.shareIcon}>in</div>
          </div>
        </header>

        {/* Featured image - dynamically selected */}
        <div className={styles.featuredImageContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={featureImage}
              alt={article.headline}
              className={styles.featuredImage}
            />
          </div>
          <p className={styles.imageCaption}>
            {article.headline.includes("McDonald")
              ? "McDonald's outlets across Singapore will participate in the special promotion. | Photo: File"
              : "The announcement has generated excitement across Singapore. | Photo: File"}
          </p>
        </div>

        {/* Content with fade effect */}
        <div className={`relative ${styles.content}`}>
          <div
            className={`${styles.proseAdapt} ${
              hasMoreContent ? "max-h-64 overflow-hidden" : ""
            }`}
          >
            {/* Add highlighted quote from article for emphasis */}
            <div className={styles.pullQuote}>&quot;{extractQuote()}&quot;</div>

            {visibleParagraphs.map((paragraph, index) => (
              <p key={`vis-${index}`}>{paragraph}</p>
            ))}

            {/* Dynamic info box based on content */}
            <div className={styles.infoBox}>
              <h3>
                {article.headline.includes("free")
                  ? "Promotion Details"
                  : "Key Information"}
              </h3>
              <ul>
                <li>Available on April 1st, 2025 only</li>
                <li>Valid at participating locations across Singapore</li>
                <li>Terms and conditions apply</li>
                {article.headline.includes("student") && (
                  <li>Valid student ID required</li>
                )}
              </ul>
            </div>
          </div>

          {hasMoreContent && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none dark:from-gray-900 dark:via-gray-900/90"></div>
          )}
        </div>

        {/* "Read Full Article" Button */}
        {hasMoreContent && (
          <div className={styles.readMoreContainer}>
            <button
              onClick={handleReadMoreClick}
              className={styles.readMoreButton}
            >
              Read Full Article
            </button>
          </div>
        )}

        {/* Dynamic related articles section */}
        <div className={styles.relatedArticles}>
          <h3 className={styles.relatedTitle}>Related Articles</h3>
          <div className={styles.relatedGrid}>
            <div className={styles.relatedItem}>
              <span className={styles.relatedCategory}>{getCategory()}</span>
              <h4>
                {article.headline.includes("McDonald")
                  ? "McDonald's Introduces New Singapore-Exclusive Menu Items"
                  : "Top 5 April Promotions in Singapore This Year"}
              </h4>
            </div>
            <div className={styles.relatedItem}>
              <span className={styles.relatedCategory}>SINGAPORE</span>
              <h4>How Singaporeans Are Celebrating April Fools&apos; Day</h4>
            </div>
            <div className={styles.relatedItem}>
              <span className={styles.relatedCategory}>
                {getCategory() === "EDUCATION" ? "CAMPUS" : "LIFESTYLE"}
              </span>
              <h4>
                {getCategory() === "EDUCATION"
                  ? "NTU Opens New Student Hub With Popular Food Chains"
                  : "The Best Deals in Singapore This Month"}
              </h4>
            </div>
          </div>
        </div>
      </article>

      <RickRollModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        viewCount={article.views}
      />
    </>
  );
}
