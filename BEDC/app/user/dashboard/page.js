import { redirect } from "next/navigation";
import Link from "next/link";
import CvProfileBuilder from "@/components/CvProfileBuilder";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { getDb, getMongoConnectionMessage, isMongoConnectionError } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const tracks = [
  {
    title: "Computer and Office Skills",
    focus: "Typing, Word, Excel, Google Drive, email, CV writing, and document work.",
    outcome: "Ready for office tasks, academic work, and basic digital service jobs.",
  },
  {
    title: "Freelancing Foundation",
    focus: "Marketplace profile, client communication, Canva tasks, data entry, and service packaging.",
    outcome: "Ready to understand beginner freelance work and present simple services.",
  },
  {
    title: "Digital Business Skills",
    focus: "Facebook page support, product posting, customer replies, basic accounts, and online selling habits.",
    outcome: "Ready to support small online businesses and manage product communication.",
  },
];

const learningSteps = [
  ["Orientation", "Understand the OSOS program, student goal, and available skill tracks."],
  ["Counselling", "Confirm the best track based on class level, device access, and career interest."],
  ["Practice", "Complete guided tasks, assignments, and mentor feedback sessions."],
  ["Portfolio", "Prepare sample work, CV basics, and proof of completed assignments."],
];

function serializeDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function displayValue(value, fallback = "Not submitted") {
  return value ? String(value) : fallback;
}

export default async function UserDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "user") {
    redirect("/user/login");
  }

  const normalizedEmail = session.username?.trim().toLowerCase();
  let user = null;
  let registration = null;
  let dbNotice = "";
  let dbError = "";

  try {
    const db = await getDb();
    user = await db.collection("users").findOne(
      { email: normalizedEmail, role: "user" },
      {
        projection: {
          name: 1,
          email: 1,
          phone: 1,
          institutionName: 1,
          classLevel: 1,
          district: 1,
          interestedSkill: 1,
          status: 1,
          passwordSetAt: 1,
          lastLoginAt: 1,
          createdAt: 1,
          cvProfile: 1,
        },
      },
    );
    registration = await db.collection("registrations").findOne({ email: normalizedEmail }, { sort: { createdAt: -1 } });
  } catch (error) {
    if (isMongoConnectionError(error)) {
      dbNotice = getMongoConnectionMessage();
    } else {
      dbError = error.message || "Unable to load dashboard data.";
    }
  }

  const studentName = displayValue(user?.name || registration?.studentName || session.name, "Student");
  const selectedSkill = displayValue(user?.interestedSkill || registration?.skill, "Counselling pending");
  const registrationStatus = displayValue(registration?.status, "No registration found");
  const accountStatus = user?.passwordSetAt || user?.status === "active" ? "Active" : "Password setup pending";
  const registeredAt = serializeDate(registration?.createdAt || user?.createdAt);
  const lastLoginAt = serializeDate(user?.lastLoginAt);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@oneskills.example";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+8801XXXXXXXXX";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "One Student One Skills";
  const profileItems = [
    ["Student name", studentName],
    ["Email", displayValue(user?.email || registration?.email || normalizedEmail)],
    ["Phone", displayValue(user?.phone || registration?.phone)],
    ["Institution", displayValue(user?.institutionName || registration?.institutionName)],
    ["Education level", displayValue(user?.classLevel || registration?.classLevel)],
    ["District", displayValue(user?.district || registration?.district)],
    ["Guardian phone", displayValue(registration?.guardianPhone, "Optional field not submitted")],
    ["Registration date", registeredAt || "Not available"],
  ];
  const selectedTrack = tracks.find((track) => track.title === selectedSkill);
  const cvProfile = {
    fullName: studentName,
    email: displayValue(user?.email || registration?.email || normalizedEmail, ""),
    phone: displayValue(user?.phone || registration?.phone, ""),
    institution: displayValue(user?.institutionName || registration?.institutionName, ""),
    educationLevel: displayValue(user?.classLevel || registration?.classLevel, ""),
    district: displayValue(user?.district || registration?.district, ""),
    skill: selectedSkill === "Counselling pending" ? "" : selectedSkill,
    objective:
      "Motivated student seeking an entry-level opportunity to apply practical digital skills, learn from real work, and contribute with clear communication and reliable task completion.",
    skills: selectedSkill === "Counselling pending" ? "Computer basics, Communication, Teamwork" : `${selectedSkill}, Communication, Teamwork`,
    education: displayValue(user?.institutionName || registration?.institutionName, ""),
    experience: "",
    projects: "",
    certifications: "One Student One Skills orientation",
    languages: "Bangla, English",
    references: "Available on request.",
    ...(user?.cvProfile || {}),
  };

  return (
    <main className="dashboardPage">
      <aside className="dashboardSidebar" aria-label="User navigation">
        <Link className="dashboardLogo" href="/">
          <span>OSOS</span>
          <strong>Student Panel</strong>
        </Link>
        <nav className="dashboardNav" aria-label="Dashboard sections">
          <a href="#overview" className="active">Overview</a>
          <a href="#profile">Profile</a>
          <a href="#cv-builder">CV builder</a>
          <a href="#learning">Learning plan</a>
          <a href="#support">Support</a>
          <Link href="/">Landing page</Link>
        </nav>
        <div className="dashboardSource">
          <span>Account</span>
          <strong>{accountStatus}</strong>
        </div>
      </aside>

      <section className="dashboardWorkspace">
        <header className="dashboardTopbar">
          <div>
            <p className="eyebrow">Student dashboard</p>
            <h1>Welcome, {studentName}</h1>
            <p>Track your registration, selected skill path, orientation status, and next program steps.</p>
          </div>
          <div className="dashboardTopActions">
            <Link className="dashboardActionLink" href="/">
              Register another student
            </Link>
            <LogoutButton />
          </div>
        </header>

        {dbNotice && <div className="dashboardNotice">{dbNotice}</div>}
        {dbError && <div className="authError">{dbError}</div>}

        <section className="dashboardStats" id="overview" aria-label="Student dashboard summary">
          <article>
            <span>Registration</span>
            <strong>{registrationStatus}</strong>
            <small>Current application status</small>
          </article>
          <article>
            <span>Selected skill</span>
            <strong className="metricDate">{selectedSkill}</strong>
            <small>Track preference</small>
          </article>
          <article>
            <span>Orientation</span>
            <strong>Free</strong>
            <small>First counselling session</small>
          </article>
          <article>
            <span>Last login</span>
            <strong className="metricDate">{lastLoginAt || "First visit"}</strong>
            <small>Bangladesh time</small>
          </article>
        </section>

        <section className="userDashboardGrid">
          <article className="dashboardPanel userProfilePanel" id="profile">
            <div className="panelHeading">
              <div>
                <h2>Student profile</h2>
                <p>Information submitted during registration.</p>
              </div>
            </div>
            <dl className="profileList">
              {profileItems.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="dashboardPanel">
            <div className="panelHeading">
              <div>
                <h2>Current track</h2>
                <p>{selectedSkill}</p>
              </div>
            </div>
            <div className="trackFocus">
              <strong>{selectedTrack ? selectedTrack.focus : "A mentor will confirm the right track after counselling."}</strong>
              <span>{selectedTrack ? selectedTrack.outcome : "Keep your phone available for the counselling call."}</span>
            </div>
            <div className="nextActions">
              <h3>Next actions</h3>
              <ul>
                <li>Keep phone and email active for orientation updates.</li>
                <li>Prepare your education level, device access, and learning goal.</li>
                <li>Join counselling before final track placement.</li>
              </ul>
            </div>
          </article>
        </section>

        <CvProfileBuilder initialProfile={cvProfile} />

        <section className="dashboardPanel" id="learning">
          <div className="panelHeading">
            <div>
              <h2>Learning plan</h2>
              <p>Standard OSOS path from registration to portfolio proof.</p>
            </div>
            <span>{learningSteps.length} stages</span>
          </div>
          <div className="learningTimeline">
            {learningSteps.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboardCards" aria-label="Available program tracks">
          {tracks.map((track) => (
            <article key={track.title}>
              <h2>{track.title}</h2>
              <p>{track.focus}</p>
            </article>
          ))}
        </section>

        <section className="dashboardPanel supportPanel" id="support">
          <div>
            <p className="eyebrow">{siteName}</p>
            <h2>Need help with your registration?</h2>
            <p>Contact the team if your information needs correction, your password link expires, or you need counselling help.</p>
          </div>
          <div className="supportContacts">
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}>{contactPhone}</a>
          </div>
        </section>
      </section>
    </main>
  );
}
