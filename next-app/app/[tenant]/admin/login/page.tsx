"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ tenant: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError("Email ou senha inválidos.");
        return;
      }
      router.push(`/${params.tenant}/admin`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg, #ece8d8)" }}>
      <div className="w-full max-w-sm rounded-3xl p-8" style={{ background: "rgba(255,253,247,0.95)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <h1 className="text-2xl font-bold mb-1">Entrar no Admin</h1>
        <p className="text-sm opacity-60 mb-6">Acesso restrito</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border px-4 py-3 text-sm focus:outline-none"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border px-4 py-3 text-sm focus:outline-none"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full py-3 font-bold text-white text-sm disabled:opacity-50"
            style={{ background: "var(--primary, #676b2a)" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
