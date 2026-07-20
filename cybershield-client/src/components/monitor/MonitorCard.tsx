import {
  Globe,
  Clock,
  Calendar,
  Trash2,
  Play,
  History,
  Bell
} from "lucide-react";

import type { MonitoredWebsite } from "../../types/monitor";

interface Props {
  website: MonitoredWebsite;
  onDelete: (id: number) => void;
  onScan: (id: number) => void;
  onHistory: (id: number) => void;
  onNotificationSettings: (id: number) => void;
  isScanning?: boolean;
}

export default function MonitorCard({
  website,
  onDelete,
  onScan,
  onHistory,
  onNotificationSettings,
  isScanning = false,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-3">

            <Globe
              className="text-cyan-600"
              size={26}
            />

            <h2 className="text-xl font-bold text-slate-800">
              {website.url}
            </h2>

          </div>

          <div className="flex gap-6 mt-5 text-sm text-slate-500">

            <div className="flex items-center gap-2">

              <Calendar size={16} />

              Created

              {new Date(
                website.createdAt
              ).toLocaleDateString()}

            </div>

            <div className="flex items-center gap-2">

              <Clock size={16} />

              Last Scan

              {website.lastScanAt
                ? new Date(
                    website.lastScanAt
                  ).toLocaleString()
                : "Never"}

            </div>

          </div>

        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            website.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {website.isActive
            ? "🟢 Active"
            : "🔴 Inactive"}
        </span>

      </div>

      <div className="flex gap-3 mt-6">

        <button
  disabled={isScanning}
  onClick={() => onScan(website.id)}
  className={`flex items-center gap-2 rounded-xl px-5 py-2 text-white transition ${
    isScanning
      ? "bg-slate-400 cursor-not-allowed"
      : "bg-cyan-600 hover:bg-cyan-700"
  }`}
>
  <Play size={18} />
  {isScanning ? "Scanning..." : "Scan Now"}
</button>

        <button
          onClick={() => onHistory(website.id)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-100 px-5 py-2 transition"
        >
          <History size={18} />

          History
        </button>

        <button
  onClick={() => onNotificationSettings(website.id)}
  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 transition"
>
  <Bell size={18} />

  Notifications
</button>

        <button
          onClick={() => onDelete(website.id)}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2 transition"
        >
          <Trash2 size={18} />

          Delete
        </button>

      </div>

    </div>
  );
}