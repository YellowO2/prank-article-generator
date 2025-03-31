import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Link Generator</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Only available for April fools! I think...
      </p>
      <Link href="/create" className="btn  btn-wide text-lg font-medium">
        Create Your Link
      </Link>
      <Link
        href="/leaderboard"
        className="mt-4 text-foreground/60 hover:text-foreground/80"
      >
        View Leaderboard →
      </Link>
    </div>
  );
}
