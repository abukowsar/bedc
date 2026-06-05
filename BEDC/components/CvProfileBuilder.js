"use client";

import { useMemo, useRef, useState } from "react";

const editableFields = [
  ["fullName", "Full name", "input"],
  ["email", "Email", "input"],
  ["phone", "Phone", "input"],
  ["institution", "Institution", "input"],
  ["educationLevel", "Education level", "input"],
  ["district", "District", "input"],
  ["skill", "Target skill", "input"],
  ["objective", "Career objective", "textarea"],
  ["skills", "Skills", "textarea"],
  ["education", "Education", "textarea"],
  ["experience", "Experience", "textarea"],
  ["projects", "Projects", "textarea"],
  ["certifications", "Certifications", "textarea"],
  ["languages", "Languages", "textarea"],
  ["references", "References", "textarea"],
];

const aiFields = new Set(["objective", "skills", "experience", "projects", "certifications"]);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lines(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildCvHtml(profile) {
  const sections = [
    ["Career Objective", profile.objective],
    ["Skills", lines(profile.skills)],
    ["Education", profile.education],
    ["Experience", lines(profile.experience)],
    ["Projects", lines(profile.projects)],
    ["Certifications", lines(profile.certifications)],
    ["Languages", profile.languages],
    ["References", profile.references || "Available on request."],
  ];

  const sectionHtml = sections
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value)))
    .map(([title, value]) => {
      const body = Array.isArray(value)
        ? `<ul>${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;

      return `<section><h2>${title}</h2>${body}</section>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(profile.fullName || "Student CV")}</title>
  <style>
    body { color: #111827; font-family: Arial, sans-serif; line-height: 1.5; margin: 36px; }
    header { border-bottom: 2px solid #111827; margin-bottom: 18px; padding-bottom: 12px; }
    h1 { font-size: 28px; margin: 0 0 6px; }
    h2 { border-bottom: 1px solid #d1d5db; font-size: 15px; letter-spacing: .04em; margin: 18px 0 8px; padding-bottom: 4px; text-transform: uppercase; }
    p { margin: 0 0 8px; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
    .contact { color: #374151; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(profile.fullName || "Student Name")}</h1>
    <p class="contact">${[profile.email, profile.phone, profile.district].filter(Boolean).map(escapeHtml).join(" | ")}</p>
    <p class="contact">${[profile.institution, profile.educationLevel, profile.skill].filter(Boolean).map(escapeHtml).join(" | ")}</p>
  </header>
  ${sectionHtml}
</body>
</html>`;
}

function buildCvText(profile) {
  return `${profile.fullName || "Student Name"}
${[profile.email, profile.phone, profile.district].filter(Boolean).join(" | ")}
${[profile.institution, profile.educationLevel, profile.skill].filter(Boolean).join(" | ")}

CAREER OBJECTIVE
${profile.objective || ""}

SKILLS
${lines(profile.skills).map((item) => `- ${item}`).join("\n")}

EDUCATION
${profile.education || ""}

EXPERIENCE
${lines(profile.experience).map((item) => `- ${item}`).join("\n")}

PROJECTS
${lines(profile.projects).map((item) => `- ${item}`).join("\n")}

CERTIFICATIONS
${lines(profile.certifications).map((item) => `- ${item}`).join("\n")}

LANGUAGES
${profile.languages || ""}

REFERENCES
${profile.references || "Available on request."}
`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CvProfileBuilder({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [uploadedText, setUploadedText] = useState("");
  const [status, setStatus] = useState("");
  const [busyField, setBusyField] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const filenameBase = useMemo(() => (profile.fullName || "student-cv").toLowerCase().replace(/[^a-z0-9]+/g, "-"), [profile.fullName]);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    setUploadedText(text);
    setStatus(`${file.name} uploaded. Paste useful lines into the profile table, then save.`);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setStatus("");

    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvProfile: profile }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setStatus(result.message || "Profile save failed.");
      return;
    }

    setProfile(result.cvProfile);
    setStatus("Profile saved.");
  };

  const improveField = async (field, label) => {
    setBusyField(field);
    setStatus("");

    const response = await fetch("/api/user/cv/ai-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: label, content: profile[field], profile }),
    });
    const result = await response.json();
    setBusyField("");

    if (!response.ok) {
      setStatus(result.message || "AI edit failed.");
      return;
    }

    updateField(field, result.text);
    setStatus(result.source === "openai" ? "AI edit applied." : "Local cleanup applied.");
  };

  return (
    <section className="dashboardPanel cvBuilderPanel" id="cv-builder">
      <div className="panelHeading">
        <div>
          <h2>Profile and CV builder</h2>
          <p>Edit the profile table, improve CV sections, and download a standard ATS-friendly CV.</p>
        </div>
        <div className="cvBuilderActions">
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Upload CV
          </button>
          <button type="button" onClick={saveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        className="hiddenFileInput"
        type="file"
        accept=".txt,.md,.rtf,.csv"
        onChange={handleUpload}
      />

      {status && <div className="dashboardNotice">{status}</div>}

      <div className="cvBuilderGrid">
        <div className="profileEditTable">
          {editableFields.map(([field, label, type]) => (
            <label key={field}>
              <span>{label}</span>
              {type === "textarea" ? (
                <textarea value={profile[field] || ""} rows={field === "objective" ? 4 : 5} onChange={(event) => updateField(field, event.target.value)} />
              ) : (
                <input value={profile[field] || ""} onChange={(event) => updateField(field, event.target.value)} />
              )}
              {aiFields.has(field) && (
                <button type="button" onClick={() => improveField(field, label)} disabled={busyField === field}>
                  {busyField === field ? "Editing..." : "AI edit"}
                </button>
              )}
            </label>
          ))}
        </div>

        <aside className="cvPreviewPanel" aria-label="CV preview">
          <div className="cvPreview">
            <h3>{profile.fullName || "Student Name"}</h3>
            <p>{[profile.email, profile.phone, profile.district].filter(Boolean).join(" | ")}</p>
            <p>{[profile.institution, profile.educationLevel, profile.skill].filter(Boolean).join(" | ")}</p>
            <h4>Career Objective</h4>
            <p>{profile.objective || "Add a short career objective."}</p>
            <h4>Skills</h4>
            <ul>
              {lines(profile.skills).map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <h4>Experience</h4>
            <ul>
              {lines(profile.experience).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="cvDownloadActions">
            <button type="button" onClick={() => downloadFile(`${filenameBase}.doc`, buildCvHtml(profile), "application/msword")}>
              Download DOC
            </button>
            <button type="button" onClick={() => downloadFile(`${filenameBase}.txt`, buildCvText(profile), "text/plain;charset=utf-8")}>
              Download TXT
            </button>
          </div>

          <label className="uploadedCvBox">
            <span>Uploaded CV text</span>
            <textarea
              value={uploadedText}
              rows="10"
              placeholder="Uploaded text appears here. You can copy useful lines into the profile table."
              onChange={(event) => setUploadedText(event.target.value)}
            />
          </label>
        </aside>
      </div>
    </section>
  );
}
