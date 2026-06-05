import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import AdminExportButtons from "@/components/AdminExportButtons";
import { getSession } from "@/lib/auth";
import { getDb, isMongoConnectionError } from "@/lib/mongodb";
import { getPendingRegistrations } from "@/lib/localRegistrations";

export const dynamic = "force-dynamic";

function serializeRegistration(registration) {
  return {
    _id: String(registration._id),
    studentName: registration.studentName || "",
    institutionName: registration.institutionName || "",
    email: registration.email || "",
    phone: registration.phone || "",
    classLevel: registration.classLevel || "",
    district: registration.district || "",
    skill: registration.skill || "",
    status: registration.status || "new",
    source: registration.source || "landing-page",
    createdAt: registration.createdAt ? new Date(registration.createdAt).toISOString() : "",
    storageStatus: registration.storageStatus || "mongodb",
  };
}

function countBy(registrations, key) {
  return registrations.reduce((counts, registration) => {
    const value = registration[key] || "Not set";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function chartItems(counts, limit = 5) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = Math.max(...entries.map(([, count]) => count), 1);
  return entries.map(([label, count]) => ({ label, count, width: `${Math.max((count / max) * 100, 8)}%` }));
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  let registrations = [];
  let totalRegistrations = 0;
  let dbError = "";
  let dbNotice = "";
  let dataSource = "MongoDB";

  try {
    const db = await getDb();
    totalRegistrations = await db.collection("registrations").countDocuments();
    registrations = await db.collection("registrations").find({}).sort({ createdAt: -1 }).limit(100).toArray();
  } catch (error) {
    if (isMongoConnectionError(error)) {
      console.error("Admin dashboard database connection failed:", error);
      dbNotice = "Local mode is active. Registrations are being saved and displayed from the pending queue until MongoDB Atlas is reachable.";
      registrations = await getPendingRegistrations();
      totalRegistrations = registrations.length;
      dataSource = "Local pending";
    } else {
      dbError = error.message || "Unable to load MongoDB data.";
    }
  }

  const dashboardRegistrations = registrations.map(serializeRegistration);
  const latestRegistrations = dashboardRegistrations.slice(0, 12);
  const skillChart = chartItems(countBy(dashboardRegistrations, "skill"));
  const districtChart = chartItems(countBy(dashboardRegistrations, "district"));
  const pendingCount = dashboardRegistrations.filter((registration) => registration.storageStatus === "pending-mongodb-sync").length;
  const uniqueDistricts = Object.keys(countBy(dashboardRegistrations, "district")).filter((district) => district !== "Not set").length;
  const newestRegistration = dashboardRegistrations[0]?.createdAt
    ? new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(
        new Date(dashboardRegistrations[0].createdAt),
      )
    : "No registrations yet";

  return (
    <main className="dashboardPage">
      <aside className="dashboardSidebar" aria-label="Admin navigation">
        <Link className="dashboardLogo" href="/">
          <span>OSOS</span>
          <strong>Admin Panel</strong>
        </Link>
        <nav className="dashboardNav" aria-label="Dashboard sections">
          <a href="#overview" className="active">Overview</a>
          <a href="#analytics">Analytics</a>
          <a href="#registrations">Registrations</a>
          <Link href="/">Landing page</Link>
        </nav>
        <div className="dashboardSource">
          <span>Data source</span>
          <strong>{dataSource}</strong>
        </div>
      </aside>

      <section className="dashboardWorkspace">
        <header className="dashboardTopbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Student registrations</h1>
            <p>Monitor One Student One Skills leads coming from the landing page popup form.</p>
          </div>
          <div className="dashboardTopActions">
            <AdminExportButtons registrations={dashboardRegistrations} />
            <LogoutButton />
          </div>
        </header>

        {dbNotice && <div className="dashboardNotice">{dbNotice}</div>}
        {dbError && <div className="authError">{dbError}</div>}

        {registrations.length === 0 && dbError ? (
          <div className="authError">No pending local registrations found yet.</div>
        ) : (
          <>
            <section className="dashboardStats" id="overview" aria-label="Dashboard summary">
              <article>
                <span>Total registrations</span>
                <strong>{totalRegistrations}</strong>
                <small>All student leads</small>
              </article>
              <article>
                <span>District coverage</span>
                <strong>{uniqueDistricts}</strong>
                <small>Districts represented</small>
              </article>
              <article>
                <span>Pending sync</span>
                <strong>{pendingCount}</strong>
                <small>Stored locally</small>
              </article>
              <article>
                <span>Latest update</span>
                <strong className="metricDate">{newestRegistration}</strong>
                <small>Bangladesh time</small>
              </article>
            </section>

            <section className="dashboardAnalytics" id="analytics" aria-label="Registration analytics">
              <article className="dashboardPanel">
                <div className="panelHeading">
                  <h2>Skill demand</h2>
                  <span>{skillChart.length} tracks</span>
                </div>
                <div className="barChart">
                  {skillChart.map((item) => (
                    <div className="barRow" key={item.label}>
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <i style={{ width: item.width }} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="dashboardPanel">
                <div className="panelHeading">
                  <h2>Top districts</h2>
                  <span>{uniqueDistricts} active</span>
                </div>
                <div className="barChart districtBars">
                  {districtChart.map((item) => (
                    <div className="barRow" key={item.label}>
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <i style={{ width: item.width }} />
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="dashboardPanel registrationsPanel" id="registrations">
              <div className="panelHeading">
                <div>
                  <h2>Recent registrations</h2>
                  <p>Latest {latestRegistrations.length} records from {dataSource.toLowerCase()}.</p>
                </div>
                <AdminExportButtons registrations={dashboardRegistrations} />
              </div>
              <div className="dashboardTable">
              <div className="tableHeader">
                <span>Name</span>
                <span>Institution</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Level</span>
                <span>District</span>
                <span>Skill</span>
              </div>
              {latestRegistrations.map((registration) => (
                <div className="tableRow" key={registration._id}>
                  <span>{registration.studentName}</span>
                  <span>{registration.institutionName || "-"}</span>
                  <span>{registration.email}</span>
                  <span>{registration.phone}</span>
                  <span>{registration.classLevel}</span>
                  <span>{registration.district}</span>
                  <span>{registration.skill}</span>
                </div>
              ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
