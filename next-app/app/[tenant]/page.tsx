import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTenantContext, slugFromHostname } from "@/lib/tenant";
import type { TenantContext } from "@/lib/tenant";

interface Props {
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tenant: tenantSlug } = await params;
  const ctx = await resolveTenant(tenantSlug);
  if (!ctx) return {};
  const texts = (ctx.settings?.texts as Record<string, string>) ?? {};
  return {
    title: ctx.tenant.name,
    description: texts.heroCopy ?? `Reserve sua quadra em ${ctx.tenant.name}`,
    themeColor: ctx.settings?.primary_color ?? "#676b2a",
  };
}

async function resolveTenant(slug: string): Promise<TenantContext | null> {
  const headersList = await headers();
  const hostname = headersList.get("host") ?? "";
  // Em produção resolve pelo hostname; em dev usa o slug da URL
  const resolvedSlug = hostname.includes("localhost") ? slug : slugFromHostname(hostname);
  return getTenantContext(resolvedSlug);
}

export default async function TenantPage({ params }: Props) {
  const { tenant: tenantSlug } = await params;
  const ctx = await resolveTenant(tenantSlug);

  if (!ctx) notFound();

  const { tenant, settings } = ctx;
  const primaryColor = settings?.primary_color ?? "#676b2a";
  const bgColor = settings?.bg_color ?? "#ece8d8";
  const logoUrl = settings?.logo_url ?? null;
  const texts = (settings?.texts as Record<string, string>) ?? {};
  const openingStart = settings?.opening_start ?? "07:00";
  const openingEnd = settings?.opening_end ?? "22:00";

  return (
    <>
      <style>{`
        :root {
          --primary: ${primaryColor};
          --bg: ${bgColor};
        }
        body { background: var(--bg); }
      `}</style>

      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header
          className="rounded-3xl p-7 mb-4"
          style={{ background: "rgba(255,253,247,0.92)", border: "1px solid rgba(255,255,255,0.8)" }}
        >
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>
                {texts.heroEyebrow ?? tenant.name}
              </p>
              <h1 className="text-5xl font-bold leading-tight mb-3" style={{ color: "var(--text, #2c3018)" }}>
                {texts.heroTitle ?? "Reserve sua quadra online."}
              </h1>
              <p className="text-sm opacity-70">
                {texts.heroCopy ?? "Consulte a agenda e faça sua reserva em poucos passos."}
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: primaryColor + "18", border: `1px solid ${primaryColor}30`, color: "var(--text, #2c3018)" }}
                >
                  {openingStart.slice(0, 5)}h às {openingEnd.slice(0, 5)}h
                </span>
              </div>
            </div>
            {logoUrl && (
              <figure className="m-0 rounded-2xl overflow-hidden w-24 h-24 flex-shrink-0" style={{ background: primaryColor }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo ${tenant.name}`} className="w-full h-full object-cover" />
              </figure>
            )}
          </div>
        </header>

        <p className="text-center text-sm opacity-50 mt-8">
          Agenda em construção — em breve aqui.
        </p>
      </div>
    </>
  );
}
