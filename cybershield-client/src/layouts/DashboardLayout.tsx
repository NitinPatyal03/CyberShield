import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <div className="fixed left-0 top-0 h-screen w-72">
          <Sidebar />
        </div>

        <div className="ml-72 flex min-h-screen flex-1 flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;