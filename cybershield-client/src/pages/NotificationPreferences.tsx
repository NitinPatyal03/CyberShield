import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPreferences,
  updatePreferences,
  resetPreferences,
} from "../services/notificationPreferenceService";
import type { NotificationPreference } from "../types/notificationPreference";


const NotificationPreferences = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] =
    useState<NotificationPreference>({
      emailEnabled: true,
      websiteOffline: true,
      invalidSsl: true,
      httpsDisabled: true,
      sslExpiringSoon: true,
      sslExpired: true,
      slowResponse: true,
      securityScoreDropped: true,
    });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);

      const data = await getPreferences(Number(websiteId));

      setPreferences(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load notification preferences.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof NotificationPreference) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updatePreferences(
        Number(websiteId),
        preferences
      );

      alert("Preferences updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetPreferences(Number(websiteId));

      await loadPreferences();

      alert("Preferences reset successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to reset preferences.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Notification Preferences
        </h1>

        <div className="space-y-5">

          <Toggle
            title="Enable Email Notifications"
            checked={preferences.emailEnabled}
            onChange={() =>
              handleChange("emailEnabled")
            }
          />

          <hr />

          <Toggle
            title="Website Offline"
            checked={preferences.websiteOffline}
            onChange={() =>
              handleChange("websiteOffline")
            }
          />

          <Toggle
            title="Invalid SSL Certificate"
            checked={preferences.invalidSsl}
            onChange={() =>
              handleChange("invalidSsl")
            }
          />

          <Toggle
            title="HTTPS Disabled"
            checked={preferences.httpsDisabled}
            onChange={() =>
              handleChange("httpsDisabled")
            }
          />

          <Toggle
            title="SSL Expiring Soon"
            checked={preferences.sslExpiringSoon}
            onChange={() =>
              handleChange("sslExpiringSoon")
            }
          />

          <Toggle
            title="SSL Certificate Expired"
            checked={preferences.sslExpired}
            onChange={() =>
              handleChange("sslExpired")
            }
          />

          <Toggle
            title="Slow Response Time"
            checked={preferences.slowResponse}
            onChange={() =>
              handleChange("slowResponse")
            }
          />

          <Toggle
            title="Security Score Dropped"
            checked={preferences.securityScoreDropped}
            onChange={() =>
              handleChange("securityScoreDropped")
            }
          />

        </div>

        <div className="flex gap-4 mt-10">

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Reset Defaults
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
};

type ToggleProps = {
  title: string;
  checked: boolean;
  onChange: () => void;
};

function Toggle({
  title,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <label className="flex items-center justify-between">

      <span className="text-lg font-medium">
        {title}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-6 h-6"
      />

    </label>
  );
}

export default NotificationPreferences;