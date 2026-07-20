import { useState } from "react";

interface Props {
  onScan: (url: string) => void;
  loading: boolean;
}

export default function ScanInput({
  onScan,
  loading,
}: Props) {
  const [url, setUrl] = useState("");

  return (
    <div className="rounded-2xl bg-white shadow-lg p-8">

      <h2 className="text-2xl font-bold">
        🌐 Website Security Scanner
      </h2>

      <p className="text-slate-500 mt-2">
        Analyze SSL, headers, cookies,
        ports and vulnerabilities.
      </p>

      <div className="mt-6 flex gap-4">

        <input
          className="flex-1 rounded-xl border p-4"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={() => onScan(url)}
          disabled={loading}
          className="rounded-xl bg-blue-600 text-white px-8 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>

      </div>

    </div>
  );
}