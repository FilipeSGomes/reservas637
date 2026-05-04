# Contexto do Projeto

| Campo            | Valor                  |
|------------------|------------------------|
| Cliente/Projeto  | Reservas 637           |
| Modo de operação | evolve                  |
| Nível de risco   | R0            |
| Operador         | filipe.gomes              |
| Data implantação | 2026-04-27 09:26:19             |

## Significado do modo

- **audit**   — somente leitura total, foco em entender e documentar
- **sustain** — correções pontuais permitidas com contrato aprovado
- **evolve**  — evolução ativa permitida com contrato aprovado

## Significado do nível de risco

| Nível | Descrição                                          |
|-------|----------------------------------------------------|
| R0    | Sandbox/teste                                      |
| R1    | Site institucional                                 |
| R2    | Sistema interno comum                              |
| R3    | Sistema com dados importantes                      |
| R4    | Sistema financeiro/fiscal/produção crítica         |
| R5    | Governo, banco, saúde, mainframe, missão crítica   |

## Restrições ativas para R0 / evolve

- Alterações permitidas com contrato de mudança
- Boas práticas de rollback recomendadas
