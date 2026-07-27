"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    router.push("/login?reset=success");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Enter your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="text-gray-700 border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="text-gray-700 border p-2 w-full mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="text-red-600 mt-4 text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}