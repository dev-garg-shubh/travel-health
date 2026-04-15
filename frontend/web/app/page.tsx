import { ScoreCard } from "@travel-health/ui";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Flight Health Score</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <ScoreCard title="Overall Health" score={78} subtitle="Sample placeholder score" />
        <ScoreCard title="Air Quality" score={81} subtitle="Fetched via analyzer pipeline" />
      </div>
    </main>
  );
}
