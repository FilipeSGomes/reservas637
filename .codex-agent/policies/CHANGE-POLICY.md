# Política de Mudança

## Regra absoluta

Nenhuma alteração em código-fonte sem contrato de mudança com status APROVADO.

## Mudanças que não exigem contrato

- Arquivos dentro de `.codex-agent/` (memória do agente)
- Documentação pura fora do runtime (README, wikis)
- Comentários não funcionais

## Mudanças que sempre exigem contrato

Qualquer arquivo que afete:

- Banco de dados (schema, migrations, queries)
- Autenticação e autorização
- Segurança (criptografia, validação, sanitização)
- Regras fiscais ou financeiras
- Integrações externas (APIs, filas, webhooks)
- Processamento batch ou mainframe
- Performance em caminho crítico
- Código compartilhado por múltiplos módulos
- Configuração de produção

## Exigências adicionais para R4/R5

- Contrato aprovado por humano identificado
- Diff mínimo (nenhuma refatoração colateral)
- Plano de teste executado antes do merge
- Plano de rollback documentado e testável
- Registro no audit log antes e depois da execução
