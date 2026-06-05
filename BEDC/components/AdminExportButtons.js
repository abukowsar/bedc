"use client";

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(registrations) {
  const columns = ["Student Name", "Institution", "Email", "Phone", "Class Level", "District", "Skill", "Status", "Created At"];
  const keys = ["studentName", "institutionName", "email", "phone", "classLevel", "district", "skill", "status", "createdAt"];
  const rows = registrations.map((registration) => keys.map((key) => escapeCsvValue(registration[key])).join(","));
  return [columns.map(escapeCsvValue).join(","), ...rows].join("\n");
}

export default function AdminExportButtons({ registrations }) {
  const hasData = registrations.length > 0;

  const exportCsv = () => {
    downloadFile("osos-registrations.csv", toCsv(registrations), "text/csv;charset=utf-8");
  };

  const exportJson = () => {
    downloadFile("osos-registrations.json", JSON.stringify(registrations, null, 2), "application/json;charset=utf-8");
  };

  return (
    <div className="dashboardExportActions" aria-label="Export registration data">
      <button type="button" onClick={exportCsv} disabled={!hasData}>
        Export CSV
      </button>
      <button type="button" onClick={exportJson} disabled={!hasData}>
        Export JSON
      </button>
    </div>
  );
}
