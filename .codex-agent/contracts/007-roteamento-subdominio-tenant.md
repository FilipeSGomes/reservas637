# Contrato 007 - Roteamento por subdominio para tenant

## Status

IMPLEMENTADO.

## Objetivo

Garantir que cada cliente seja resolvido pelo subdominio fisamtech.com, permitindo operar 637, Euphoria e futuros clientes sem selecao manual.

Exemplos:

- 637.fisamtech.com -> tenant 637
- euphoria.fisamtech.com -> tenant euphoria
- outrocliente.fisamtech.com -> tenant outrocliente

## Contexto

A feature microSaaS ja possui config/clients.js e config/config-loader.js. O loader ja suporta hostnameMap, mas precisa ser tratado como regra principal de produto e nao apenas fallback tecnico.

## Arquivos permitidos para leitura

- config/clients.js
- config/config-loader.js
- config/_client-template.config.js
- config/637.config.js
- index.html
- admin/index.html
- instalar.html
- app.js
- sw.js
- MULTICLIENTE.md
- GO-LIVE-NOVO-CLIENTE.md
- PLANO-EXECUCAO-SAAS.md
- PLANO-SOLO-FOUNDER-SAAS.md

## Arquivos permitidos para alteracao

- config/clients.js
- config/config-loader.js
- MULTICLIENTE.md
- GO-LIVE-NOVO-CLIENTE.md
- PLANO-EXECUCAO-SAAS.md
- PLANO-SOLO-FOUNDER-SAAS.md
- .codex-agent/CHANGELOG-AGENTE.md
- .codex-agent/DECISOES.md
- .codex-agent/GAPS.md

## Arquivos proibidos

- app.js, exceto se for estritamente necessario para exibir tenant/debug sem mudar regra de reserva.
- google-sheets-template/*
- dados reais de clientes sem confirmacao.

## Regras tecnicas

1. Hostname deve ter precedencia sobre localStorage.
2. Query string client pode existir apenas para preview/teste.
3. Subdominio desconhecido nao deve cair silenciosamente em cliente errado em producao.
4. Localhost deve continuar permitindo preview por query string.
5. Toda documentacao deve deixar claro que subdominio e o caminho oficial para producao.

## Plano de execucao

1. Formalizar hostnameMap como origem oficial de tenant em producao.
2. Documentar regra de precedencia: query de preview, hostname, storage, default.
3. Definir comportamento para subdominio desconhecido.
4. Validar 637.fisamtech.com e euphoria.fisamtech.com no registry.
5. Atualizar runbook de go-live com passo de DNS/subdominio.

## Plano de teste

1. Simular loader com hostname 637.fisamtech.com.
2. Simular loader com hostname euphoria.fisamtech.com.
3. Simular localhost com client=demo.
4. Simular hostname conhecido com storage conflitante.
5. Rodar node --check nos arquivos JS alterados.

## Rollback

Reverter commit do contrato e voltar config/clients.js para mapa anterior com apenas 637 e demo.

## Criterios de aceite

- 637.fisamtech.com resolve tenant 637.
- euphoria.fisamtech.com resolve tenant euphoria.
- storage antigo nao troca tenant em dominio de producao.
- runbook documenta DNS/subdominio como etapa obrigatoria.
