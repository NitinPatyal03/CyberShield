import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Profile from "./pages/Profile";
import HistoryDetails from "./pages/HistoryDetails";
import Monitoring from "./pages/Monitoring";
import MonitoringHistory from "./pages/MonitoringHistory";
import Alerts from "./pages/Alerts";
import NotificationPreferences from "./pages/NotificationPreferences";


import UserManagement from "./pages/admin/UserManagement";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* User Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history/:id" element={<HistoryDetails />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route
            path="/monitoring/:id/history"
            element={<MonitoringHistory />}
          />
          <Route path="/alerts" element={<Alerts />} />
          <Route
            path="/notifications/:websiteId"
            element={<NotificationPreferences />}
          />

          {/* Admin Pages */}
          <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;