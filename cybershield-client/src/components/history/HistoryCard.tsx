import {
  Globe,
  Shield,
  Lock,
  Trash2,
  Eye,
  FileDown,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ScanHistory } from "../../services/historyService";

interface Props {
  scan: ScanHistory;
  onDelete: (id: number) => void;
}


export default function HistoryCard({
  scan,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-6">

      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* Left */}

        <div className="space-y-3">

          <div className="flex items-center gap-2">
            <Globe size={20} className="text-blue-600" />
            <h2 className="font-semibold text-lg break-all">
              {scan.url}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-gray-500">

            <Clock size={16} />

            {new Date(scan.scanDate).toLocaleString()}

          </div>

          <div className="flex gap-3 flex-wrap">

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                scan.isCertificateValid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Lock size={14} className="inline mr-1" />
              {scan.isCertificateValid
                ? "SSL Secure"
                : "SSL Invalid"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                scan.securityScore >= 90
                  ? "bg-green-100 text-green-700"
                  : scan.securityScore >= 70
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Shield size={14} className="inline mr-1" />
              Grade {scan.grade}
            </span>

          </div>

        </div>

        {/* Right */}

        <div className="text-center md:text-right">

          <p className="text-gray-500 text-sm">
            Security Score
          </p>

          <h2 className="text-5xl font-bold text-blue-600">
            {scan.securityScore}
          </h2>

          <div className="flex gap-2 mt-5 justify-center md:justify-end">

            <button
  onClick={() => navigate(`/history/${scan.id}`)}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  <Eye size={18} />
  View
</button>

            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FileDown size={18} />
              PDF
            </button>

            <button
              onClick={() => onDelete(scan.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={18} />
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}