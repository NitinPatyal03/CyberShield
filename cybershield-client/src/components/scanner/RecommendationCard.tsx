interface Props {
  recommendations: string[];
}

export default function RecommendationCard({
  recommendations,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <h2 className="text-xl font-bold mb-6">
        Recommendations
      </h2>

      <ul className="space-y-4">

        {recommendations.map((r, index) => (
          <li
            key={index}
            className="flex gap-3"
          >
            ✅ {r}
          </li>
        ))}

      </ul>

    </div>
  );
}