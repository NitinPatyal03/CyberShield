import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  deleteHistory,
  getHistory,
  type ScanHistory,
} from "../services/historyService";
import HistoryStats from "../components/history/HistoryStats";
import HistoryCard from "../components/history/HistoryCard";



export default function History() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistory();
      setHistory(data);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this scan?")) return;

    await deleteHistory(id);

    setHistory((prev) => prev.filter((x) => x.id !== id));
  }

  const filtered = useMemo(() => {
    return history.filter((x) =>
      x.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  if (loading)
    return (
      <div className="p-6 text-center">
        Loading history...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
  Scan History
</h1>

<HistoryStats history={history} />

<div className="relative mb-6">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          className="w-full border rounded-lg pl-10 pr-4 py-2"
          placeholder="Search website..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="grid gap-5">

        {filtered.map((scan) => (

          <HistoryCard
  key={scan.id}
  scan={scan}
  onDelete={remove}
/>

        ))}

      </div>

    </div>
  );
}