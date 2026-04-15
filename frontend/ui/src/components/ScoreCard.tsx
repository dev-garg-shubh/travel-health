import React from "react";

type ScoreCardProps = {
  title: string;
  score: number;
  subtitle?: string;
};

export function ScoreCard({ title, score, subtitle }: ScoreCardProps) {
  return (
    <article style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
      <p style={{ margin: "12px 0", fontSize: 32, fontWeight: 700 }}>{score}</p>
      {subtitle ? <p style={{ margin: 0, color: "#6b7280" }}>{subtitle}</p> : null}
    </article>
  );
}
