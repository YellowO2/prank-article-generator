import { getTopArticles } from "@/database-functions";
import Link from "next/link";

export const revalidate = 60; // Refresh every 60s

export default async function Leaderboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10) || 1;
  const pageSize = 10;

  // Grab the top 100 articles
  const allArticles = await getTopArticles(100);

  const totalPages = Math.max(1, Math.ceil(allArticles.length / pageSize));
  const validPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (validPage - 1) * pageSize;
  const articles = allArticles.slice(startIndex, startIndex + pageSize);

  return (
    <div className="max-w-4xl mx-auto p-8 text-foreground">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Top Articles 🗣️ 🔥</h1>
        <Link href="/" className="btn btn-sm btn-ghost">
          ← Back
        </Link>
      </div>

      <div className="space-y-3">
        {allArticles.length === 0 ? (
          <p className="text-base-content/50 text-center py-8">
            No pranks generated yet!
          </p>
        ) : (
          articles.map((article, i) => (
            <div
              key={article.slug}
              className="flex items-center justify-between p-4 border border-base-content/10 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span
                  className={`text-xl font-bold w-10 text-center shrink-0 ${
                    startIndex + i === 0
                      ? "text-yellow-500"
                      : startIndex + i === 1
                        ? "text-slate-400"
                        : startIndex + i === 2
                          ? "text-amber-600"
                          : "text-base-content/30"
                  }`}
                >
                  #{startIndex + i + 1}
                </span>
                <div className="truncate">
                  <Link
                    href={`/article/${article.slug}`}
                    className="font-semibold text-lg hover:underline truncate block"
                  >
                    {article.headline}
                  </Link>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-center justify-center min-w-[5rem] px-3 py-1.5 bg-amber-500/10 rounded-xl">
                <span className="text-2xl font-bold text-amber-500">
                  {article.views.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80 mt-0.5">
                  Victims
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Link
            href={`/leaderboard?page=${Math.max(1, validPage - 1)}`}
            className={`btn btn-sm ${validPage === 1 ? "btn-disabled opacity-50" : ""}`}
            aria-disabled={validPage === 1}
          >
            ← Prev
          </Link>
          <span className="text-sm font-medium mx-2 bg-base-200 px-3 py-1 rounded">
            Page {validPage} of {totalPages}
          </span>
          <Link
            href={`/leaderboard?page=${Math.min(totalPages, validPage + 1)}`}
            className={`btn btn-sm ${validPage === totalPages ? "btn-disabled opacity-50" : ""}`}
            aria-disabled={validPage === totalPages}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}
