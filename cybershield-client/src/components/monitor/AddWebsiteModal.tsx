import { useState } from "react";
import { X, Plus } from "lucide-react";
import { addWebsite } from "../../services/monitorService";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddWebsiteModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      await addWebsite(url);

      toast.success("Website added successfully!");

      setUrl("");

      onSuccess();

      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data || "Unable to add website."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Add Website
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <label className="block text-sm font-medium mb-2">
          Website URL
        </label>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 flex items-center gap-2"
          >
            <Plus size={18} />

            {loading ? "Adding..." : "Add Website"}
          </button>

        </div>

      </div>

    </div>
  );
}