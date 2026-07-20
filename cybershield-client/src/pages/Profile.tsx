import { useEffect, useState } from "react";
import { User, Mail, Shield, Save, Edit3 } from "lucide-react";
import { getProfile, updateProfile } from "../services/profileService";
import type { Profile } from "../types/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    } catch (err) {
      console.error(err);
      alert("Unable to load profile.");
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("First Name and Last Name are required.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile(firstName.trim(), lastName.trim());

      await loadProfile();

      setEditing(false);

      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96 text-lg font-semibold">
        Loading Profile...
      </div>
    );
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 h-24" />

        <div className="px-10 pb-10">

          <div className="-mt-10 flex justify-between items-start">

            <div className="flex items-center gap-6">

              <div className="h-24 w-24 rounded-full bg-cyan-500 text-white text-3xl font-bold flex items-center justify-center border-4 border-white shadow-lg">
                {initials}
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>

                <p className="text-gray-500 flex items-center gap-2 mt-2">
                  <Mail size={16} />
                  {profile.email}
                </p>

                <span className="inline-flex mt-3 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                  {profile.role}
                </span>
              </div>

            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-xl hover:bg-cyan-700 transition"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">

                <button
                  onClick={() => {
                    setFirstName(profile.firstName);
                    setLastName(profile.lastName);
                    setEditing(false);
                  }}
                  className="px-5 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save"}
                </button>

              </div>
            )}

          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            {/* Personal Information */}

            <div className="bg-slate-50 rounded-xl p-6">

              <h2 className="text-lg font-semibold mb-6">
                Personal Information
              </h2>

              <label className="block mb-2 font-medium">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                disabled={!editing}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100"
              />

              <label className="block mb-2 font-medium">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                disabled={!editing}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100"
              />

            </div>

            {/* Account Information */}

            <div className="bg-slate-50 rounded-xl p-6">

              <h2 className="text-lg font-semibold mb-6">
                Account Information
              </h2>

              <div className="space-y-6">

                <div className="flex items-start gap-3">
                  <User className="text-cyan-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">
                      {profile.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-cyan-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="text-cyan-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">
                      {profile.role}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}