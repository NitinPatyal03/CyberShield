import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

import HistoryStats from "../components/monitor/HistoryStats";

import { getWebsiteHistory } from "../services/monitorService";

import type { MonitorHistory } from "../types/monitor";

export default function MonitoringHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState<MonitorHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);

      const data = await getWebsiteHistory(Number(id));

      setHistory(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load monitoring history.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent mx-auto"></div>

          <p className="mt-4 text-slate-500">
            Loading monitoring history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-slate-300 p-2 hover:bg-slate-100 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Monitoring History
          </h1>

          <p className="mt-2 text-slate-500">
            Website ID : {id}
          </p>
        </div>

      </div>

      {/* Stats */}

      <HistoryStats history={history} />

      {/* Empty State */}

      {history.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">

          <h2 className="text-2xl font-semibold text-slate-700">
            No Scan History
          </h2>

          <p className="mt-3 text-slate-500">
            Scan this website to generate monitoring history.
          </p>

        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="sticky top-0 bg-slate-100">

                <tr>

                  <th className="p-4 text-left">Date</th>

                  <th className="p-4 text-left">Score</th>

                  <th className="p-4 text-left">Grade</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left">Response</th>

                  <th className="p-4 text-left">HTTPS</th>

                  <th className="p-4 text-left">Certificate</th>

                </tr>

              </thead>

              <tbody>

                {history.map((scan) => (

                  <tr
                    key={scan.id}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-4">
                      {new Date(scan.scanDate).toLocaleString()}
                    </td>

                    <td
                      className={`p-4 font-bold ${
                        scan.securityScore >= 90
                          ? "text-green-600"
                          : scan.securityScore >= 70
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {scan.securityScore}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          scan.grade.startsWith("A")
                            ? "bg-green-100 text-green-700"
                            : scan.grade.startsWith("B")
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {scan.grade}
                      </span>

                    </td>

                    <td className="p-4">

                      <span
                        className={`font-semibold ${
                          scan.statusCode === 200
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {scan.statusCode}
                      </span>

                    </td>

                    <td className="p-4">

                      {scan.responseTime} ms

                    </td>

                    <td className="p-4 text-xl">

                      {scan.isHttps ? "✅" : "❌"}

                    </td>

                    <td className="p-4 text-xl">

                      {scan.isCertificateValid ? "✅" : "❌"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}
    </div>
  );
}