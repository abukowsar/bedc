import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

function localImproveText(content, section) {
  const cleaned = String(content || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (cleaned.length === 0) {
    return section === "objective"
      ? "Motivated student seeking an entry-level opportunity to apply practical digital skills, communicate clearly, and grow through real work experience."
      : "";
  }

  return cleaned
    .map((line) => {
      const sentence = line.replace(/^[-•\d.\s]+/, "");
      return sentence.endsWith(".") ? sentence : `${sentence}.`;
    })
    .join("\n");
}

function readResponseText(result) {
  if (result.output_text) {
    return result.output_text.trim();
  }

  return (
    result.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text || "")
      .join("\n")
      .trim() || ""
  );
}

export async function POST(request) {
  const session = await getSession();

  if (!session || session.role !== "user") {
    return NextResponse.json({ message: "Please login first." }, { status: 401 });
  }

  const { section = "CV section", content = "", profile = {} } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      text: localImproveText(content, section),
      source: "local",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        max_output_tokens: 700,
        input: [
          {
            role: "system",
            content:
              "You improve student CV text for Bangladesh entry-level roles. Keep it truthful, ATS-friendly, concise, professional, and easy to scan. Return only the rewritten section text.",
          },
          {
            role: "user",
            content: `Section: ${section}
Student profile:
Name: ${profile.fullName || ""}
Education: ${profile.educationLevel || ""}
Institution: ${profile.institution || ""}
Target skill: ${profile.skill || ""}

Current text:
${content}`,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        ok: true,
        text: localImproveText(content, section),
        source: "local",
        warning: result.error?.message || "AI service unavailable, used local cleanup.",
      });
    }

    return NextResponse.json({
      ok: true,
      text: readResponseText(result) || localImproveText(content, section),
      source: "openai",
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      text: localImproveText(content, section),
      source: "local",
      warning: error.message || "AI service unavailable, used local cleanup.",
    });
  }
}
