import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PublicLayout from "./layouts/PublicLayout"
import DashboardLayout from "./layouts/DashboardLayout"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Sandboxes from "./pages/Sandboxes"

import ResourceUsage from "./pages/ResourceUsage"
import Settings from "./pages/Settings"
import TestHistory from "./pages/TestHistory"
import RunDetails from "./pages/RunDetails"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sandboxes" element={<Sandboxes />} />
          <Route path="history" element={<TestHistory />} />
          <Route path="history/:runId" element={<RunDetails />} />
          <Route path="resources" element={<ResourceUsage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
