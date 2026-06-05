"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm({ role, title, subtitle }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.message || "Login failed.");
      return;
    }

    router.push(result.redirectTo);
    router.refresh();
  }

  return (
    <main className="authPage">
      <section className="authCard">
        <Link className="authBrand" href="/">
          One Student One Skills
        </Link>
        <div>
          <p className="eyebrow">{role} login</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {error && <div className="authError">{error}</div>}

        <form className="authForm" onSubmit={handleSubmit}>
          <label>
            {role === "user" ? "Registered email" : "Username"}
            <input name="username" type={role === "user" ? "email" : "text"} autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
