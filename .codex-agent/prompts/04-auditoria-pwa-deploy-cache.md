# PROMPT 04 — Auditoria de PWA, Deploy e Cache

## Modo

SOMENTE LEITURA para runtime/código-fonte.
ESCRITA permitida apenas em `.codex-agent/`.

## Dependências

- Executar após `00-descoberta-inicial`.

## Escopo Exato

Arquivos para leitura:

- `index.html`
- `instalar.html`
- `manifest.webmanifest`
- `sw.js`
- `styles.css`
- `CNAME`
- `README.md`

## Objetivo

Auditar:

- Manifesto PWA.
- Registro de service worker.
- Lista de arquivos cacheados.
- Estratégia de cache.
- Risco de assets obsoletos.
- Deploy em GitHub Pages/domínio customizado.
- Página de instalação.

## Atualizar em `.codex-agent/`

- `.codex-agent/README-PROJETO.md`
- `.codex-agent/MAPA-MENTAL.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Entrega

- Mapa de cache e assets.
- Riscos de atualização/rollback.
- Checklist manual de validação PWA.
- Nenhuma alteração em código.
