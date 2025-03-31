import styles from "./article.module.css";

export default function Article({ params }: { params: { slug: string } }) {
  // ...existing code...
  const article = {
    title:
      "Breaking: Scientists Discover That Coffee Actually Makes You Sleep Better",
    author: "Dr. April Foolsworth",
    date: "April 1, 2025",
    readTime: "4 min read",
    content: `In a groundbreaking study that has left the scientific community bewildered, researchers at the prestigious Institute of Beverage Studies have discovered that coffee, contrary to popular belief, is actually a powerful sleep aid.

    The study, conducted over a period of three months with 1,000 participants, showed that individuals who consumed espresso shots immediately before bedtime fell asleep an average of 73% faster than those who didn't. "We're as surprised as anyone," says lead researcher Dr. Bean Counter.

    The research team initially thought there must be a mistake in their methodology when they observed participants dozing off mid-sip during their controlled trials. However, repeated experiments confirmed their findings: the stronger the coffee, the deeper the sleep.

    "This completely changes everything we thought we knew about caffeine," explains Dr. Counter. "It turns out we've been drinking coffee in the morning when we should have been having it at night all along."

    Major coffee chains are already adapting to this news, with plans to open special evening cafes branded as "sleep cafes." Starbucks has announced a new menu item called the "Bedtime Brew," while other chains are racing to create their own sleep-inducing coffee concoctions.`,
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;700&display=swap"
      />
      <article className={styles.articleContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.metadata}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar} />
              <span>{article.author}</span>
            </div>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        <div className={styles.content}>
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </div>
      </article>
    </>
  );
}
