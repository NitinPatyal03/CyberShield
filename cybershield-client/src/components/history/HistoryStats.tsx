import type { ScanHistory } from "../../services/historyService";

interface Props {
  history: ScanHistory[];
}

export default function HistoryStats({ history }: Props) {
  const total = history.length;

  const average =
    total > 0
      ? Math.round(
          history.reduce(
            (sum, h) => sum + h.securityScore,
            0
          ) / total
        )
      : 0;

  const highest =
    total > 0
      ? Math.max(...history.map(h => h.securityScore))
      : 0;

  const highRisk =
    history.filter(h => h.securityScore < 70).length;

  const cards = [
    {
      title: "Total Scans",
      value: total,
    },
    {
      title: "Average Score",
      value: average,
    },
    {
      title: "Highest Score",
      value: highest,
    },
    {
      title: "High Risk",
      value: highRisk,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      {cards.map(card => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow border p-5"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}