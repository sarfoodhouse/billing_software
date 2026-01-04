"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkCredentials, setAuthenticated, isAuthenticated } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkCredentials(phone.trim(), password)) {
      setAuthenticated();
      router.replace("/");
    } else {
      setError("Invalid phone or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <h1 className="text-lg font-semibold text-slate-900 mb-4 text-center">
          SAR Restrat Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-sm">
            <label className="block text-slate-600 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50"
              required
            />
          </div>
          <div className="text-sm">
            <label className="block text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50"
              required
            />
          </div>
          {error && (
            <div className="text-xs text-red-500">{error}</div>
          )}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
