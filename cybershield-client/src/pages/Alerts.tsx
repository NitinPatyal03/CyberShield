import { useEffect, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import {
  getAlerts,
  markAsRead,
  markAllAsRead,
  deleteAlert,
} from "../services/alertService";
import type { SecurityAlert } from "../types/alert";

export default function Alerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRead = async (id: number) => {
    await markAsRead(id);
    loadAlerts();
  };

  const handleDelete = async (id: number) => {
    await deleteAlert(id);
    loadAlerts();
  };

  const handleReadAll = async () => {
    await markAllAsRead();
    loadAlerts();
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Security Alerts
        </h1>

        <button
          onClick={handleReadAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Mark All Read
        </button>

      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          🎉 No security alerts found.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}