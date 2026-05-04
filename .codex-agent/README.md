# .codex-agent — FISAM AI Governance

Camada de governança de IA implantada neste projeto.

| Campo          | Valor                |
|----------------|----------------------|
| Cliente/Projeto | Reservas 637        |
| Nível de risco  | R0         |
| Modo            | evolve               |
| Implantado em   | 2026-04-27 09:26:19          |
| Operador        | filipe.gomes           |

---

## Fluxo de trabalho

### 1. Escanear o projeto (antes de tudo)

Gera mapa estrutural real do projeto. Roda em segundos. Não depende do agente.

```bash
./.codex-agent/scripts/scan-project.sh
```

### 2. Iniciar descoberta

O agente lê o scan e começa análise em modo somente leitura.

```bash
./.codex-agent/scripts/start-discovery.sh
```

### 3. Criar contrato de mudança

Quando quiser propor uma alteração.

```bash
./.codex-agent/scripts/new-change.sh "descrição da mudança"
```

### 4. Aprovar contrato

Após preencher e revisar o contrato.

```bash
./.codex-agent/scripts/approve-contract.sh .codex-agent/contracts/ARQUIVO.md
```

### 5. Executar mudança

Só após aprovação — usar o prompt de execução:

```
.codex-agent/prompts/99-template-correcao-segura.md
```

### 6. Consultar audit log

```bash
./.codex-agent/scripts/show-log.sh        # últimas 50 entradas
./.codex-agent/scripts/show-log.sh all    # histórico completo
```

---

## Princípio

Primeiro entender.
Depois documentar.
Depois dividir.
Depois criar prompts.
Só então alterar.
