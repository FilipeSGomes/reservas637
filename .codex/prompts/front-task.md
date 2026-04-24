Crie um sistema web estático de reserva de quadras esportivas.

STACK:
- HTML + CSS + JS puro (sem frameworks)
- Google Sheets como banco via API pública
- GitHub Pages para hospedar

QUADRAS:
- 2 de Beach Tennis (BT1, BT2)
- 2 de Tênis (TN1, TN2)

FLUXO PÚBLICO:
1. Ver grade de horários (07h às 22h, blocos de 1h)
2. Clicar num horário disponível
3. Preencher nome + telefone
4. Ver chave PIX e valor na tela
5. Status fica "pendente" até admin confirmar

PAINEL ADMIN (senha simples via prompt JS):
- Senha hardcoded no JS
- Ver todas as reservas do dia
- Confirmar pagamento PIX (muda status para "confirmado")
- Bloquear horário manualmente
- Ver nome e telefone de quem reservou

GOOGLE SHEETS:
- Aba "reservas": data, quadra, horário, nome, telefone, status
- Aba "bloqueios": data, quadra, horário, motivo
- Leitura via Google Sheets API (chave pública)
- Escrita via Google Apps Script como webhook POST

VISUAL:
- Cores: verde para disponível, vermelho para ocupado, 
  amarelo para pendente
- Mobile first
- Grade visual por quadra e horário