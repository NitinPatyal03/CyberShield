import type { MonitorHistory } from "../../types/monitor";

interface Props {
  history: MonitorHistory[];
}

export default function HistoryStats({ history }: Props) {
  if (history.length === 0) return null;

  const totalScans = history.length;

  const averageScore = Math.round(
    history.reduce((sum, item) => sum + item.securityScore, 0) /
      totalScans
  );

  const bestGrade = history
    .map((x) => x.grade)
    .sort()[0];

  const lastScan = new Date(history[0].scanDate)
    .toLocaleDateString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

      <StatCard
        title="Total Scans"
        value={totalScans}
      />

      <StatCard
        title="Average Score"
        value={averageScore}
      />

      <StatCard
        title="Best Grade"
        value={bestGrade}
      />

      <StatCard
        title="Last Scan"
        value={lastScan}
      />

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}