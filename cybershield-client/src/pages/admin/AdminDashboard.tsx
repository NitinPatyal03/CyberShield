import { useEffect, useState } from "react";
import { getDashboard } from "../../services/adminService";
import StatCard from "../../components/ui/StatCard";

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalAdmins: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <h2 className="text-xl font-semibold text-slate-600">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Overview of all CyberShield users.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon="👥"
          color="#2563EB"
          subtitle="Registered users"
        />

        <StatCard
          title="Admins"
          value={data.totalAdmins}
          icon="👑"
          color="#8B5CF6"
          subtitle="System administrators"
        />

        <StatCard
          title="Active Users"
          value={data.activeUsers}
          icon="🟢"
          color="#22C55E"
          subtitle="Can access system"
        />

        <StatCard
          title="Blocked Users"
          value={data.blockedUsers}
          icon="⛔"
          color="#EF4444"
          subtitle="Access disabled"
        />

      </div>

      <div className="rounded-xl bg-white shadow">

    <div className="border-b px-6 py-4">

        <h2 className="text-xl font-bold">
            System Summary
        </h2>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-2">

        <div>

            <h3 className="font-semibold text-slate-700">
                User Statistics
            </h3>

            <ul className="mt-4 space-y-3">

                <li>
                    👥 Total Users : <b>{data.totalUsers}</b>
                </li>

                <li>
                    👑 Admins : <b>{data.totalAdmins}</b>
                </li>

                <li>
                    🟢 Active Users : <b>{data.activeUsers}</b>
                </li>

                <li>
                    ⛔ Blocked Users : <b>{data.blockedUsers}</b>
                </li>

            </ul>

        </div>

        <div>

            <h3 className="font-semibold text-slate-700">
                System Health
            </h3>

            <div className="mt-4 space-y-4">

                <div className="rounded-lg bg-green-100 p-4">
                    Authentication Service ✔
                </div>

                <div className="rounded-lg bg-green-100 p-4">
                    Database Connected ✔
                </div>

                <div className="rounded-lg bg-green-100 p-4">
                    API Running ✔
                </div>

            </div>

        </div>

    </div>

</div>

    </div>
    
  );
}
