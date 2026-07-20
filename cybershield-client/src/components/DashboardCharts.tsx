import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";

import type { DashboardData } from "../services/dashboardService";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartsProps {
  data: DashboardData;
}

export default function DashboardCharts({
  data,
}: DashboardChartsProps) {
  const recentScans = data.recentScans ?? [];

  const lineData = {
    labels:
      recentScans.length > 0
        ? recentScans.map((scan) =>
            new Date(scan.scanDate).toLocaleDateString()
          )
        : ["No Data"],

    datasets: [
      {
        label: "Security Score",
        data:
          recentScans.length > 0
            ? recentScans.map((scan) => scan.score)
            : [0],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563EB",
        pointBorderColor: "#2563EB",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Secure", "High Risk"],
    datasets: [
      {
        data: [
          Math.max(data.totalScans - data.totalHighRisk, 0),
          data.totalHighRisk,
        ],
        backgroundColor: ["#22C55E", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#334155",
          font: {
            size: 13,
            weight: "bold",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#334155",
        },
        grid: {
          color: "rgba(148,163,184,0.3)",
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#334155",
        },
        grid: {
          color: "rgba(148,163,184,0.3)",
        },
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          font: {
            size: 13,
            weight: "bold",
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Security Trend
        </h2>

        <div className="h-[320px]">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Scan Distribution
        </h2>

        <div className="h-[320px]">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}