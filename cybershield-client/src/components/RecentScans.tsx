import type { RecentScan } from "../services/dashboardService";

interface Props {
  scans: RecentScan[];
}

export default function RecentScans({ scans }: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-lg border border-slate-200">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold">Recent Scans</h2>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Website</th>
            <th className="px-6 py-3 text-center">Score</th>
            <th className="px-6 py-3 text-center">Grade</th>
            <th className="px-6 py-3 text-center">Date</th>
          </tr>
        </thead>

        <tbody>
          {scans.map((scan) => (
            <tr
              key={scan.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4">{scan.url}</td>

              <td className="text-center">{scan.score}</td>

              <td className="text-center">
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                  {scan.grade}
                </span>
              </td>

              <td className="text-center">
                {new Date(scan.scanDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}