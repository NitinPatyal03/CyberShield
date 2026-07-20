import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { MonitoredWebsite } from "../types/monitor";

import {
  getMonitoredWebsites,
  deleteWebsite,
  scanWebsite,
} from "../services/monitorService";

import MonitorStats from "../components/monitor/MonitorStats";
import MonitorCard from "../components/monitor/MonitorCard";
import AddWebsiteModal from "../components/monitor/AddWebsiteModal";

export default function Monitoring() {
  const [websites, setWebsites] = useState<MonitoredWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [scanningId, setScanningId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadWebsites();
  }, []);

  function handleNotificationSettings(id: number) {
    navigate(`/notifications/${id}`);
}

  async function loadWebsites() {
    try {
      setLoading(true);

      const data = await getMonitoredWebsites();

      setWebsites(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load monitored websites.");
    } finally {
      setLoading(false);
    }
  }

  async function handleScan(id: number) {
    try {
      setScanningId(id);

      await scanWebsite(id);

      await loadWebsites();

      toast.success("Website scanned successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Scan failed.");
    } finally {
      setScanningId(null);
    }
  }
  

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website?"
    );

    if (!confirmed) return;

    try {
      await deleteWebsite(id);

      setWebsites((prev) => prev.filter((w) => w.id !== id));

      toast.success("Website deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete website.");
    }
  }

    function handleHistory(id: number) {

    navigate(`/monitoring/${id}/history`);

}

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Website Monitoring
          </h1>

          <p className="mt-2 text-slate-500">
            Manage websites that CyberShield continuously monitors.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700 transition"
        >
          + Add Website
        </button>
      </div>

      {/* Stats */}
      <MonitorStats websites={websites} />

      {/* Website List */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading monitored websites...
          </p>
        </div>
      ) : websites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="text-2xl font-semibold text-slate-800">
            No websites added yet
          </h3>

          <p className="mt-3 text-slate-500">
            Click <strong>+ Add Website</strong> to start monitoring your first
            website.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {websites.map((website) => (
            <MonitorCard
    key={website.id}
    website={website}
    onDelete={handleDelete}
    onScan={handleScan}
    onHistory={handleHistory}
    onNotificationSettings={handleNotificationSettings}
    isScanning={scanningId === website.id}
/>
          ))}
        </div>
      )}

      {/* Add Website Modal */}
      <AddWebsiteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadWebsites}
      />
    </div>
  );
}