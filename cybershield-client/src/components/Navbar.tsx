import {
  LayoutDashboard,
  ShieldCheck,
  Globe,
  History,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import NotificationBell from "../layouts/NotificationBell";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const location = useLocation();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://cybershield-api-jh2q.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  const pageMap: Record<
    string,
    {
      title: string;
      subtitle: string;
      icon: React.ReactNode;
    }
  > = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Monitor your website security in real time",
      icon: <LayoutDashboard size={28} />,
    },
    "/scanner": {
      title: "Website Scanner",
      subtitle: "Scan websites for vulnerabilities",
      icon: <ShieldCheck size={28} />,
    },
    "/monitoring": {
      title: "Website Monitoring",
      subtitle: "Manage websites under continuous monitoring",
      icon: <Globe size={28} />,
    },
    "/history": {
      title: "Scan History",
      subtitle: "View previous security scans",
      icon: <History size={28} />,
    },
    "/profile": {
      title: "Profile",
      subtitle: "Manage your CyberShield account",
      icon: <User size={28} />,
    },
  };

  const current =
    pageMap[location.pathname] ?? {
      title: "CyberShield",
      subtitle: "Security Dashboard",
      icon: <ShieldCheck size={28} />,
    };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">

      <div className="flex items-center gap-4">

        <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
          {current.icon}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {current.title}
          </h2>

          <p className="text-slate-500">
            {current.subtitle}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-5">

        <div className="hidden md:block text-right">

          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString()}
          </p>

          <p className="text-xs text-slate-400">
            {new Date().toLocaleTimeString()}
          </p>

        </div>

        <div className="h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
          <NotificationBell />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2">

          <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
            {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-xs text-slate-500">
              {user.role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;