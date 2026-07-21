import {
  Trash2,
  CheckCircle
} from "lucide-react";

import type { SecurityAlert } from "../../types/alert";

interface Props {
  alert: SecurityAlert;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function AlertCard({
  alert,
  onRead,
  onDelete,
}: Props) {

  const severityColor = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow border p-5 ${
        !alert.isRead
          ? "border-red-400"
          : "border-gray-200"
      }`}
    >
      <div className="flex justify-between">

        <div>

          <h2 className="font-semibold text-lg">
            {alert.title}
          </h2>

          <p className="text-gray-500">
            {alert.website}
          </p>

          <p className="mt-2">
            {alert.description}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
              severityColor[
                alert.severity as keyof typeof severityColor
              ]
            }`}
          >
            {alert.severity}
          </span>

          <p className="text-xs text-gray-500 mt-3">
            {new Date(alert.createdAt).toLocaleString()}
          </p>

        </div>

        <div className="flex flex-col gap-2">

          {!alert.isRead && (
            <button
              onClick={() => onRead(alert.id)}
              className="text-green-600"
            >
              <CheckCircle />
            </button>
          )}

          <button
            onClick={() => onDelete(alert.id)}
            className="text-red-600"
          >
            <Trash2 />
          </button>

        </div>

      </div>
    </div>
  );
}