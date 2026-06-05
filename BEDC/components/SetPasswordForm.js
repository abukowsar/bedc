"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SetPasswordForm({ token }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.message || "Unable to set password.");
      return;
    }

    setMessage("Password set successfully. Redirecting to login...");
    setTimeout(() => router.push(result.redirectTo || "/user/login"), 900);
  }

  return (
    <main className="authPage">
      <section className="authCard">
        <Link className="authBrand" href="/">
          One Student One Skills
        </Link>
        <div>
          <p className="eyebrow">Student account</p>
          <h1>Set your password</h1>
          <p>Create a password for your registered email, then login to the user dashboard.</p>
        </div>

        {!token && <div className="authError">Password setup token is missing.</div>}
        {error && <div className="authError">{error}</div>}
        {message && <div className="successBox">{message}</div>}

        <form className="authForm" onSubmit={handleSubmit}>
          <label>
            New password
            <input name="password" type="password" minLength="8" required disabled={!token || isLoading} />
          </label>
          <label>
            Confirm password
            <input name="confirmPassword" type="password" minLength="8" required disabled={!token || isLoading} />
          </label>
          <button type="submit" disabled={!token || isLoading}>
            {isLoading ? "Saving..." : "Set password"}
          </button>
        </form>
      </section>
    </main>
  );
}
