import { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import { getDashboard } from "../services/dashboardService";
import RecentScans from "../components/RecentScans";

interface DashboardData {
  totalScans: number;
  averageScore: number;
  bestGrade: string;
  totalHighRisk: number;
  recentScans: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg font-medium text-slate-600">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Security Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor your website security in real time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Scans"
          value={data.totalScans}
          icon="📊"
          color="#2563EB"
          subtitle="All scans performed"
        />

        <StatCard
          title="Average Score"
          value={data.averageScore}
          icon="⭐"
          color="#22C55E"
          subtitle="Overall security"
        />

        <StatCard
          title="Best Grade"
          value={data.bestGrade}
          icon="🛡"
          color="#8B5CF6"
          subtitle="Highest achieved"
        />

        <StatCard
          title="High Risk"
          value={data.totalHighRisk}
          icon="🚨"
          color="#EF4444"
          subtitle="Needs attention"
        />
      </div>

      <DashboardCharts data={data} />

<RecentScans scans={data.recentScans} />
    </div>
    
  );
}