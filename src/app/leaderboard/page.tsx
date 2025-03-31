export default function Leaderboard() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Top Pranks</h1>
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 rounded border">Today</button>
        <button className="px-4 py-2 rounded border">This Week</button>
        <button className="px-4 py-2 rounded border">All Time</button>
      </div>
      <div className="space-y-4">
        {/* Placeholder for leaderboard items */}
        <div className="p-4 border rounded">
          <h3 className="font-bold">Loading pranks...</h3>
        </div>
      </div>
    </div>
  );
}
