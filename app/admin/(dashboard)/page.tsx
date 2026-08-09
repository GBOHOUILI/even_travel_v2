import { DashboardStatsGrid } from "@/components/admin/DashboardStatsGrid";

export default function AdminDashboardPage() {
  return (
    <section className="admin-dashboard-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Tableau de Bord</h1>
      </div>
      <DashboardStatsGrid />
    </section>
  );
}
