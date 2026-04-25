Preciso evoluir o sistema de reserva de quadras existente.
Altere o MÍNIMO possível do que já funciona.

CONTEXTO:
- Sistema já funciona com grade de horários, reserva e 
  integração com Google Sheets via Apps Script
- Stack: HTML + CSS + JS puro, sem frameworks

ALTERAÇÕES NECESSÁRIAS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0. REFORMULE VISUAL ESTILIZACAO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usar Bootstrap 5 para estilização.
CDN: https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PRÉ-RESERVA (antes de confirmar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quando o usuário clicar num horário disponível, 
antes de qualquer formulário, exibir um modal de 
alerta com:
- Nome da quadra e horário selecionado
- Valor da hora
- Texto: "Ao confirmar, você concorda com as regras 
  de uso da quadra. Cancelamentos devem ser feitos 
  com 2h de antecedência."
- Botões: "Cancelar" e "Continuar reserva"
Só avança pro formulário se clicar em "Continuar".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. FORMULÁRIO DE CADASTRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Adicionar campo CPF ao formulário existente
(nome, telefone já existem — adiciona CPF com 
máscara 000.000.000-00)
Salvar CPF junto com os outros dados no Sheets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. FORMA DE PAGAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Após preencher o cadastro, exibir tela de escolha:

OPÇÃO A — PIX:
- Exibe chave PIX e valor
- Instrução: "Envie o comprovante pelo WhatsApp"
- Status fica "pendente" até admin confirmar
- Fluxo atual mantido

OPÇÃO B — FATURAMENTO:
- Exibe mensagem: "Valor será lançado na sua conta. 
  Pagamento no final do mês."
- Campo de observação opcional
- Status salvo como "faturado" no Sheets
- Não exige comprovante

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. BOTÃO "INSTALE O APP"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Adicionar botão fixo ou no topo da página:
"📲 Instale o app"

Ao clicar, abre página secundária (instalar.html) com:

IPHONE:
- Passo 1: Abra este site no Safari
- Passo 2: Toque no ícone de compartilhar (⬆️)
- Passo 3: Role e toque em 
  "Adicionar à Tela de Início"
- Passo 4: Toque em "Adicionar"
- Imagem ilustrativa de cada passo se possível

ANDROID:
- Passo 1: Abra este site no Chrome
- Passo 2: Toque nos 3 pontos (⋮) no canto superior
- Passo 3: Toque em 
  "Adicionar à tela inicial"
- Passo 4: Confirme tocando em "Adicionar"

Visual simples, mobile first, consistente com o 
design atual do sistema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS GERAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Não quebrar nenhuma funcionalidade existente
- Manter o mesmo padrão visual atual
- Mobile first em tudo
- Salvar CPF e forma de pagamento no Sheets
- Faturamento não exige confirmação de PIX