# AGENTS.md — Sistema de Reserva 637 Cervejaria

## Visão geral do projeto

Sistema de reserva de quadras esportivas para a 637 Cervejaria.
Frontend estático hospedado no GitHub Pages.
Sem backend próprio — toda persistência via Google Sheets + Apps Script.

---

## Stack obrigatória

- HTML5 + CSS3 + JavaScript puro (ES6+)
- Usar Bootstrap 5 via CDN para componentes visuais. Sem outras bibliotecas externas.
- SEM bibliotecas externas (sem jQuery, Bootstrap, etc.)
- Google Sheets como banco de dados (leitura via gviz/tq, escrita via Apps Script webhook)
- GitHub Pages para hospedagem

---

## Estrutura de arquivos

```
/
├── index.html          # Página principal com a grade de horários
├── instalar.html       # Página de instrução para instalar como PWA
├── app.js              # Toda a lógica JavaScript
├── style.css           # Estilos globais
├── manifest.json       # PWA manifest
└── images/             # Assets visuais
```

---

## Variáveis de configuração (app.js)

```javascript
const spreadsheetId = '1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc';
const googleSheetsApiKey = ''; // não necessário — planilha pública
const appsScriptWebhookUrl = 'https://script.google.com/macros/s/AKfycbwY20dNukwG6anIDRf8j41vPk95KLrC7TTshMjrfJ1z3k1F3aWnaslX7AfTOjzvSTga/exec';
const sheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;
```

Nunca altere esses valores. Nunca mova para outro arquivo.

---

## Quadras disponíveis

| ID    | Nome           | Tipo         |
|-------|----------------|--------------|
| BT1   | Beach Tennis 1 | Beach Tennis |
| BT2   | Beach Tennis 2 | Beach Tennis |
| TN1   | Tênis 1        | Tênis        |
| TN2   | Tênis 2        | Tênis        |

Horários: 07h às 22h, blocos de 1 hora.

---

## Estrutura do Google Sheets

### Aba: `reservas`
| Coluna | Campo      |
|--------|------------|
| A      | data       |
| B      | quadra     |
| C      | horario    |
| D      | nome       |
| E      | telefone   |
| F      | cpf        |
| G      | status     |
| H      | pagamento  |
| I      | observacao |

Status possíveis: `pendente` | `confirmado` | `faturado`
Pagamento possíveis: `pix` | `faturamento`

### Aba: `bloqueios`
| Coluna | Campo   |
|--------|---------|
| A      | data    |
| B      | quadra  |
| C      | horario |
| D      | motivo  |

---

## Actions do Apps Script (webhook POST)

```javascript
// Criar reserva
{ action: 'reservation:create', payload: { data, quadra, horario, nome, telefone, cpf, status, pagamento, observacao } }

// Confirmar reserva (admin)
{ action: 'reservation:confirm', payload: { data, quadra, horario, telefone } }

// Criar bloqueio (admin)
{ action: 'block:create', payload: { data, quadra, horario, motivo } }
```

---

## Status visual na grade

| Status     | Cor      |
|------------|----------|
| disponível | verde    |
| pendente   | amarelo  |
| confirmado | vermelho |
| bloqueado  | cinza    |
| faturado   | azul     |

---

## Fluxo do usuário (ordem obrigatória)

```
1. Ver grade de horários
2. Clicar em horário disponível
3. Modal de PRÉ-RESERVA (alerta de regras + confirmação)
4. Formulário: nome + telefone + CPF
5. Escolha de pagamento: PIX ou Faturamento
   → PIX: exibe chave + valor + instrução WhatsApp
   → Faturamento: exibe mensagem de lançamento em conta
6. Reserva salva no Sheets com status correto
```

---

## Painel Admin

- Acesso por senha simples hardcoded no JS
- Funções: ver reservas do dia, confirmar PIX, bloquear horário
- Reservas faturadas não precisam de confirmação de pagamento
- Visível apenas após login admin

---

## Regras de desenvolvimento

1. **Nunca quebrar funcionalidade existente** — qualquer alteração deve ser aditiva
2. **Mobile first** — todo novo componente deve funcionar perfeitamente em 375px
3. **Sem dependências externas** — não adicionar CDNs, npm packages ou bibliotecas
4. **Sem comentários desnecessários** — código limpo e autoexplicativo
5. **Nunca alterar** `spreadsheetId`, `appsScriptWebhookUrl` ou a estrutura das abas do Sheets
6. **Sempre testar** o fluxo completo após qualquer alteração: reserva → sheets → admin

---

## O que NÃO fazer

- Não criar backend, servidor ou banco de dados próprio
- Não adicionar autenticação complexa — senha simples no JS é suficiente
- Não alterar a estrutura do Apps Script sem necessidade
- Não usar localStorage para dados críticos de reserva
- Não criar rotas SPA — páginas separadas são suficientes (index.html, instalar.html)
- Não adicionar animações pesadas que impactem performance mobile

---

## Contexto de negócio

- Cliente: 637 Cervejaria — espaço de tênis, beach tennis e cerveja artesanal
- Usuários: clientes da cervejaria reservando quadras pelo celular
- Admin: dono da cervejaria confirmando pagamentos e gerenciando agenda
- Custo de operação: zero (GitHub Pages + Google Sheets gratuitos)
- URL de produção: https://637.fisamtech.com