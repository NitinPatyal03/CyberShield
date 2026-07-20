import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { confirmLogout } from "../utils/alert";

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {

    const result = await confirmLogout();

    if (!result.isConfirmed)
        return;

    logout();

    toast.success("Logged out successfully.");

    navigate("/login");

};

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Scanner",
      path: "/scanner",
      icon: "🛡",
    },
    {
      name: "Monitoring",
      path: "/monitoring",
      icon: "🌐",
    },
    {
      name: "History",
      path: "/history",
      icon: "📜",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  const adminMenu = [
  {
    name: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: "📈",
  },
  {
    name: "User Management",
    path: "/admin/users",
    icon: "👥",
  },
  // {
  //   name: "Website Management",
  //   path: "/admin/websites",
  //   icon: "🌐",
  // },
  // {
  //   name: "Audit Logs",
  //   path: "/admin/audit-logs",
  //   icon: "📋",
  // },
  // {
  //   name: "Analytics",
  //   path: "/admin/analytics",
  //   icon: "📊",
  // },
];

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col">

      <div className="p-8 border-b border-slate-200">

        <h1 className="text-3xl font-bold text-cyan-600">
          🛡 CyberShield
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Security Dashboard
        </p>

      </div>

      <nav className="flex-1 px-4 py-8">

        <div className="space-y-2">

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}

        </div>
        {user?.role === "Admin" && (
  <>
    <div className="mt-8 mb-3 px-4 text-xs font-bold uppercase text-slate-400">
      Administration
    </div>

    <div className="space-y-2">
      {adminMenu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
              isActive
                ? "bg-purple-600 text-white"
                : "hover:bg-slate-100"
            }`
          }
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  </>
)}

      </nav>

      <div className="p-5 border-t border-slate-200">

        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;