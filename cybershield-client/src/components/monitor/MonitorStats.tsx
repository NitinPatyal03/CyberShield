import { Globe, CheckCircle, Clock } from "lucide-react";
import type { MonitoredWebsite } from "../../types/monitor";

interface Props {
  websites: MonitoredWebsite[];
}

export default function MonitorStats({ websites }: Props) {
  const total = websites.length;

  const active = websites.filter((w) => w.isActive).length;

  const lastScan = websites
    .filter((w) => w.lastScanAt)
    .sort(
      (a, b) =>
        new Date(b.lastScanAt!).getTime() -
        new Date(a.lastScanAt!).getTime()
    )[0];

  const cards = [
    {
      title: "Total Websites",
      value: total,
      icon: <Globe size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Active",
      value: active,
      icon: <CheckCircle size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Last Scan",
      value: lastScan
        ? new Date(lastScan.lastScanAt!).toLocaleDateString()
        : "Never",
      icon: <Clock size={24} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
        >
          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {card.value}
              </h2>

            </div>

            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${card.color}`}
            >
              {card.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}