# PROMPT 00 — Descoberta Inicial do Projeto

## Modo obrigatório

SOMENTE LEITURA para runtime/código-fonte.
ESCRITA OBRIGATÓRIA em `.codex-agent/`.

Proibições:
- Não altere código-fonte.
- Não instale dependências.
- Não rode comandos destrutivos.
- Não formate arquivos.
- Não refatore.
- Não assuma regra de negócio.
- Não registre valores de credenciais, senhas ou tokens encontrados.

## Contexto obrigatório — leia ANTES de qualquer análise

1. `.codex-agent/PROJECT-CONTEXT.md` — nível de risco e modo ativo
2. `.codex-agent/AGENTS.md` — regras e identidade do agente
3. `.codex-agent/index/PROJECT-SCAN.md` — mapa estrutural gerado pelo scan

> O scan já fez a varredura de pastas e contagem de arquivos.
> Use-o como ponto de partida. Não recriar o que o scan já fez.

## Objetivo

Criar a primeira camada de inteligência técnica e persistir o aprendizado
na raiz `.codex-agent/`. O objetivo não é ler tudo — é entender o suficiente
para classificar risco, identificar módulos críticos e criar o próximo conjunto
de prompts incrementais.

## Estratégia de amostragem

Use o `PROJECT-SCAN.md` para decidir o que ler. Priorize nesta ordem:

1. Arquivos de configuração raiz (package.json, pom.xml, build.gradle,
   Gemfile, requirements.txt, go.mod, Cargo.toml, .env.example, etc.)
2. Entrypoints principais detectados no scan
3. Arquivos de rotas ou controllers (máx. 3–5 amostras)
4. Arquivos de migração de banco mais recentes (máx. 3)
5. Arquivos de CI/CD e deploy
6. README existente (se houver)
7. Arquivos de teste (1–2 amostras para entender padrão)

**Não tente ler tudo.** Se o projeto for grande, documente o plano de
indexação por partes em `.codex-agent/index/INDEXING-PLAN.md`.

## Tarefas

1. Detectar linguagens e tecnologias a partir do scan + amostragem.
2. Detectar frameworks e versões.
3. Detectar banco de dados e ORM.
4. Detectar scripts de build, teste e execução.
5. Detectar módulos críticos (autenticação, financeiro, fiscal, integrações).
6. Detectar integrações externas.
7. Detectar arquivos de configuração de ambiente.
8. Identificar segredos hardcoded (registrar existência, nunca o valor).
9. Detectar ausência de testes, documentação e observabilidade.
10. Criar inventário de módulos críticos em `.codex-agent/index/MODULES.md`.
11. Atualizar `README-PROJETO.md`.
12. Atualizar `MAPA-MENTAL.md`.
13. Atualizar `RISCOS.md`.
14. Atualizar `GAPS.md`.
15. Atualizar `DECISOES.md` com hipóteses, perguntas pendentes e assunções proibidas.
16. Atualizar `PADROES.md`.
17. Atualizar `SCORECARD.md` com primeira avaliação.
18. Atualizar `CHANGELOG-AGENTE.md` com resumo desta sessão.
19. Criar próximos prompts incrementais em `.codex-agent/prompts/`.

## Regras para prompts incrementais

Cada prompt criado deve especificar:

- Modo (somente leitura / alteração controlada)
- Escopo exato (quais arquivos/módulos cobrir)
- Quais arquivos de `.codex-agent/` deve atualizar
- Dependências (quais prompts anteriores devem ter sido executados)

## Saída obrigatória

Ao final, informe no chat:

1. Arquivos lidos (lista).
2. Arquivos criados/alterados em `.codex-agent/` (lista).
3. Tecnologias detectadas.
4. Top 5 riscos identificados.
5. Top 5 gaps identificados.
6. Perguntas pendentes registradas.
7. Se foram detectados segredos/dados sensíveis (sim/não/suspeita — sem valores).
8. Próximos 5 prompts recomendados com justificativa.
9. Projeto pode sair do modo somente leitura? (sim/não/condicionado a quê)
