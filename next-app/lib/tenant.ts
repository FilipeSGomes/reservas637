import { createServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];
export type TenantSettings = Database["public"]["Tables"]["tenant_settings"]["Row"];

export interface TenantContext {
  tenant: TenantRow;
  settings: TenantSettings | null;
}

/**
 * Resolve o slug do tenant a partir do hostname da requisição.
 * Ex: "euphoria.fisamtech.com" → "euphoria"
 *     "meudominio.com.br" → lookup na tabela tenant_domains
 */
export function slugFromHostname(hostname: string): string {
  // Subdomínio padrão fisamtech.com
  if (hostname.endsWith(".fisamtech.com")) {
    return hostname.replace(".fisamtech.com", "").split(".").shift() ?? "";
  }
  // Domínio customizado — retorna o hostname completo para lookup posterior
  return hostname;
}

/**
 * Busca o tenant pelo slug ou hostname customizado.
 * Retorna null se não encontrado.
 */
export async function getTenantContext(
  slugOrHostname: string
): Promise<TenantContext | null> {
  const supabase = createServiceClient();

  // Tenta resolver pelo slug direto
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slugOrHostname)
    .eq("active", true)
    .maybeSingle();

  if (error || !tenant) {
    // Tenta resolver pelo hostname customizado em tenant_domains
    const { data: domain } = await supabase
      .from("tenant_domains")
      .select("tenant_id, tenants(*)")
      .eq("hostname", slugOrHostname)
      .maybeSingle();

    if (!domain?.tenants) return null;

    const tenantFromDomain = Array.isArray(domain.tenants)
      ? domain.tenants[0]
      : domain.tenants;

    const { data: settings } = await supabase
      .from("tenant_settings")
      .select("*")
      .eq("tenant_id", tenantFromDomain.id)
      .maybeSingle();

    return { tenant: tenantFromDomain, settings };
  }

  const { data: settings } = await supabase
    .from("tenant_settings")
    .select("*")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  return { tenant, settings };
}
