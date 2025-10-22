import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout";
import DashboardPage from "../pages/Dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
