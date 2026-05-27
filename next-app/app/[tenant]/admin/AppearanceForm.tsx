"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TenantSettings } from "@/lib/tenant";

interface Props {
  tenantId: string;
  settings: TenantSettings | null;
}

function extractDominantColors(img: HTMLImageElement, count = 6): string[] {
  try {
    const canvas = document.createElement("canvas");
    const SIZE = 80;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const colorMap: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 128) continue;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 230 || lum < 20) continue;
      const key = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
      colorMap[key] = (colorMap[key] ?? 0) + 1;
    }
    return Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([key]) => {
        const [r, g, b] = key.split(",").map(Number);
        return "#" + [r, g, b].map((v) => Math.min(255, v).toString(16).padStart(2, "0")).join("");
      });
  } catch {
    return [];
  }
}

const FONT_BODY_OPTIONS = ["", "Manrope", "Inter", "Nunito", "Lato", "Open Sans"];
const FONT_HEADING_OPTIONS = ["", "Barlow Condensed", "Bebas Neue", "Oswald", "Raleway", "Montserrat"];

export default function AppearanceForm({ tenantId, settings }: Props) {
  const [primaryColor, setPrimaryColor] = useState(settings?.primary_color ?? "#676b2a");
  const [bgColor, setBgColor] = useState(settings?.bg_color ?? "#ece8d8");
  const [fontBody, setFontBody] = useState(settings?.font_body ?? "");
  const [fontHeading, setFontHeading] = useState(settings?.font_heading ?? "");
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo_url ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [swatches, setSwatches] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    const img = new Image();
    img.onload = () => {
      const colors = extractDominantColors(img, 6);
      setSwatches(colors);
      if (colors[0]) setPrimaryColor(colors[0]);
    };
    img.src = url;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const supabase = createClient();
      let logoUrl = settings?.logo_url ?? null;

      // Upload da logo para Supabase Storage se foi alterada
      if (logoFile) {
        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `logos/${tenantId}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("tenant-assets")
          .upload(path, logoFile, { upsert: true, contentType: logoFile.type });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from("tenant-assets")
          .getPublicUrl(path);
        logoUrl = publicUrl;
      }

      // Salva settings no banco
      const { error } = await supabase
        .from("tenant_settings")
        .upsert({
          tenant_id: tenantId,
          primary_color: primaryColor,
          bg_color: bgColor,
          font_body: fontBody || null,
          font_heading: fontHeading || null,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: "tenant_id" });

      if (error) throw error;

      // Aplica imediatamente na página
      document.documentElement.style.setProperty("--primary", primaryColor);
      document.documentElement.style.setProperty("--bg", bgColor);

      setStatus("Aparência salva com sucesso.");
    } catch (err) {
      setStatus("Erro ao salvar: " + (err instanceof Error ? err.message : "tente novamente."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold uppercase tracking-wide opacity-60">Logo</p>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-20 h-20 rounded-xl object-cover border"
            style={{ borderColor: "rgba(44,48,24,0.18)" }}
          />
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
        {swatches.length > 0 && (
          <div>
            <p className="text-xs opacity-60 mb-2">Cores da logo — clique para usar como cor principal:</p>
            <div className="flex gap-2 flex-wrap">
              {swatches.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => setPrimaryColor(color)}
                  className="w-9 h-9 rounded-lg border-2 cursor-pointer flex-shrink-0"
                  style={{ background: color, borderColor: color === primaryColor ? "#000" : "rgba(44,48,24,0.2)" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cores */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide opacity-60">Cores</p>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Cor principal</span>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-lg border cursor-pointer p-0.5"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setPrimaryColor(e.target.value); }}
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
              placeholder="#676b2a"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Cor de fundo</span>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-lg border cursor-pointer p-0.5"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBgColor(e.target.value); }}
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "rgba(44,48,24,0.18)" }}
              placeholder="#ece8d8"
            />
          </div>
        </label>
      </div>

      {/* Tipografia */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide opacity-60">Tipografia</p>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fonte do corpo</span>
          <select
            value={fontBody}
            onChange={(e) => setFontBody(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "rgba(44,48,24,0.18)" }}
          >
            {FONT_BODY_OPTIONS.map((f) => (
              <option key={f} value={f}>{f || "Padrão (Manrope)"}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fonte dos títulos</span>
          <select
            value={fontHeading}
            onChange={(e) => setFontHeading(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "rgba(44,48,24,0.18)" }}
          >
            {FONT_HEADING_OPTIONS.map((f) => (
              <option key={f} value={f}>{f || "Padrão (Barlow Condensed)"}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full py-3 font-bold text-white text-sm disabled:opacity-50"
          style={{ background: "var(--primary, #676b2a)" }}
        >
          {saving ? "Salvando..." : "Salvar aparência"}
        </button>
        {status && <p className="text-sm opacity-70">{status}</p>}
      </div>
    </form>
  );
}
