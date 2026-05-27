import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenantContext, slugFromHostname } from "@/lib/tenant";
import AppearanceForm from "./AppearanceForm";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function AdminPage({ params }: Props) {
  const { tenant: tenantSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redireciona para login se não autenticado
  if (!user) redirect(`/${tenantSlug}/admin/login`);

  const headersList = await headers();
  const hostname = headersList.get("host") ?? "";
  const resolvedSlug = hostname.includes("localhost") ? tenantSlug : slugFromHostname(hostname);
  const ctx = await getTenantContext(resolvedSlug);

  if (!ctx) redirect("/");

  // Verifica membership do usuário no tenant
  const { data: membership } = await supabase
    .from("tenant_memberships")
    .select("role")
    .eq("tenant_id", ctx.tenant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect(`/${tenantSlug}/admin/login`);

  const { tenant, settings } = ctx;
  const primaryColor = settings?.primary_color ?? "#676b2a";

  return (
    <>
      <style>{`:root { --primary: ${primaryColor}; --bg: ${settings?.bg_color ?? "#ece8d8"}; } body { background: var(--bg); }`}</style>

      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header
          className="rounded-3xl p-7 mb-4"
          style={{ background: "rgba(255,253,247,0.92)", border: "1px solid rgba(255,255,255,0.8)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: primaryColor }}>
            {tenant.name} • Administração
          </p>
          <h1 className="text-3xl font-bold">Painel administrativo</h1>
          <p className="text-sm opacity-60 mt-1">Acesso restrito para gestão de reservas e configurações.</p>
        </header>

        <section className="rounded-2xl p-6 mb-4" style={{ background: "rgba(255,253,247,0.92)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <h2 className="text-xl font-bold mb-4">Aparência</h2>
          <AppearanceForm tenantId={tenant.id} settings={settings} />
        </section>

        <section className="rounded-2xl p-6 opacity-40" style={{ background: "rgba(255,253,247,0.92)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <h2 className="text-xl font-bold mb-2">Reservas e bloqueios</h2>
          <p className="text-sm">Em construção.</p>
        </section>
      </div>
    </>
  );
}
