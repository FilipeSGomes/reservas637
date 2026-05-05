# Contrato 005 — Correção de Overflow do Campo de Data (Mobile)

## Status

PENDENTE DE APROVAÇÃO

## 1. Objetivo

Corrigir o overflow horizontal do campo de data na tela de agenda em mobile, garantindo que o input respeite os limites internos do card/toolbar sem alterar regras funcionais do sistema.

## 2. Contexto do Problema

Sintoma reportado:
- Em telas de celular, o input de data ultrapassa o limite horizontal do container, invadindo a lateral direita.

Resultado esperado:
- Campo de data 100% contido no card, sem scroll horizontal no `body`, ícone do calendário visível e layout desktop preservado.

## 3. Escopo de Leitura Permitido

- `index.html`
- `styles.css`
- `app.js` (somente para garantir que não há impacto funcional)
- `.codex-agent/DECISOES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`

## 4. Escopo de Alteração Permitido

- `styles.css`
- (Opcional e mínimo, se necessário) `index.html`
- `.codex-agent/CHANGELOG-AGENTE.md`
- `.codex-agent/DECISOES.md`

## 5. Arquivos Proibidos

- `app.js` (sem alteração funcional)
- `sw.js`
- `manifest.webmanifest`
- `admin/index.html`
- `google-sheets-template/*`

## 6. Regras Técnicas Obrigatórias

1. Não alterar regras de agenda, reserva, preço, disponibilidade ou integrações.
2. Não adicionar bibliotecas/dependências.
3. Não trocar `input[type="date"]` por componente externo.
4. Priorizar classes existentes no projeto (evitar classes genéricas desnecessárias).
5. Manter desktop igual ou melhor.

## 7. Plano de Execução (Alteração Mínima Segura)

1. Identificar wrapper real do campo de data na toolbar (`.field` + `#date-input` e container pai relevante).
2. Aplicar correção de largura/box model no wrapper:
   - `width: 100%`
   - `max-width: 100%`
   - `box-sizing: border-box`
   - `min-width: 0` (quando em flex/grid)
3. Aplicar correção no `input[type="date"]` e/ou `#date-input`:
   - `width: 100%`
   - `max-width: 100%`
   - `min-width: 0`
   - `box-sizing: border-box`
4. Revisar media query mobile existente (`max-width: 759px`) e ajustar padding lateral do contexto, apenas se necessário para conter overflow.
5. Verificar inputs similares no mesmo contexto (filtros/selects/horários) e aplicar a mesma regra somente se risco real de overflow for identificado.

## 8. Plano de Teste Manual Obrigatório

Validar no DevTools nas larguras:
- 360px
- 390px
- 430px
- 768px

Checklist:
1. Campo de data não ultrapassa limites do card/container.
2. Não há rolagem horizontal no `body`.
3. Ícone de calendário permanece visível e clicável.
4. Touch target continua confortável.
5. Layout desktop permanece estável.
6. Console sem erros relacionados à mudança.

## 9. Plano de Rollback

1. Reverter commit dos ajustes em `styles.css` (e `index.html` se usado).
2. Publicar versão anterior.
3. Revalidar visual da toolbar e campo de data.

## 10. Critérios de Aceite

1. Em 360px o input de data está totalmente contido no card.
2. Em 390px alinhamento interno correto sem invasão lateral.
3. Em 430px permanece usável e sem overflow.
4. Em 768px mantém integridade visual.
5. Em desktop não há regressão perceptível.
6. Sem mudança de comportamento funcional da agenda/reserva.
