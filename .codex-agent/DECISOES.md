# Decisões, Hipóteses e Perguntas

> [CONFIRMADO] = verificado no código ou documentação
> [HIPÓTESE]   = dedução não verificada — não agir sobre ela sem confirmar
> [PENDENTE]   = pergunta sem resposta — bloqueia alteração até responder

## Decisões Confirmadas

- [CONFIRMADO] O projeto é frontend estático sem backend próprio no repositório.
- [CONFIRMADO] A leitura operacional usa Google Sheets via `gviz/tq`.
- [CONFIRMADO] A escrita operacional usa Apps Script via POST JSON.
- [CONFIRMADO] O painel admin usa senha simples hardcoded no JavaScript.
- [CONFIRMADO] Há fallback local com `localStorage` quando não há configuração remota.
- [CONFIRMADO] O deploy esperado usa GitHub Pages com domínio customizado em `CNAME`.
- [CONFIRMADO] Bootstrap 5.3.0 é usado via CDN.
- [CONFIRMADO] Não há dependências npm nem scripts de build/teste detectados.
- [CONFIRMADO] A URL de Apps Script presente no código é a URL oficial de produção.
- [CONFIRMADO] O Apps Script de produção é igual ao código versionado em `google-sheets-template/apps-script.gs`; alterações futuras devem ser versionadas nesse arquivo.
- [CONFIRMADO] A senha admin pode ser mantida por enquanto.
- [CONFIRMADO] O proprietário confirmará pagamentos PIX olhando a conta destino; não haverá integração automática de pagamento neste ciclo.
- [CONFIRMADO] Reservas com status `faturado` exigem ação posterior, mas nenhuma ação será implementada por enquanto.
- [CONFIRMADO] O sistema deve bloquear reservas em datas passadas.
- [CONFIRMADO] Suporte principal esperado: Android, iOS, Chrome e Safari em celulares e computadores.
- [CONFIRMADO] Não há rollback definido para GitHub Pages.
- [CONFIRMADO] Não há backup periódico próprio da planilha; a operação depende do versionamento/histórico automático do Google Sheets.
- [CONFIRMADO] Primeira correção segura selecionada, aprovada e implementada no repositório: bloquear reservas públicas em datas passadas no frontend e no Apps Script.
- [CONFIRMADO] O contrato 001 incrementa `CACHE_NAME` para invalidar app shell antigo.

## Hipóteses

- [HIPÓTESE] A planilha configurada em produção está publicada para leitura pública.
- [HIPÓTESE] O valor por quadra configurado no cliente é regra comercial vigente.
- [HIPÓTESE] `localStorage` deve ser apenas fallback de desenvolvimento, não caminho operacional.
- [HIPÓTESE] A senha admin poderia ser ofuscada/criptografada no cliente, mas isso não deve ser tratado como autenticação forte se a validação continuar no frontend.
- [HIPÓTESE] "Política padrão" de LGPD deve ser formalizada em texto objetivo antes de mudanças que ampliem coleta, exibição ou retenção de dados.

## Perguntas Pendentes

- [PENDENTE] Qual texto exato da política padrão de LGPD será adotado para CPF e telefone: finalidade, retenção, acesso e exclusão?
- [PENDENTE] A senha admin deve ser apenas mantida, trocada, ou ofuscada/hasheada como redução superficial de exposição?
- [PENDENTE] Qual ação posterior será necessária para reservas `faturado` em uma fase futura?
- [PENDENTE] Qual será o procedimento mínimo de rollback em GitHub Pages?
- [PENDENTE] O histórico automático do Google Sheets é suficiente para o risco operacional aceito ou será necessário export manual periódico?
- [PENDENTE] A regra de bloquear datas passadas deve também impedir bloqueios admin em datas passadas ou apenas reservas públicas?
- [PENDENTE] Deve haver validação formal de CPF ou basta formato obrigatório?
- [PENDENTE] Deve haver validação/máscara de telefone no frontend?
- [PENDENTE] Apps Script deve recusar payload com `status` diferente do status derivado pelo pagamento?
- [PENDENTE] Apps Script deve recusar `reservation:confirm` quando a reserva estiver `faturado`?
- [PENDENTE] Apps Script deve validar quadra e horário contra listas fechadas?
- [PENDENTE] O painel admin precisa exibir CPF completo ou pode mascarar por padrão?
- [PENDENTE] Por quanto tempo reservas antigas devem permanecer identificáveis na planilha?
- [PENDENTE] O campo observação pode conter dados sensíveis livres ou deve ter orientação/restrição?
- [PENDENTE] Qual procedimento de troca de senha/admin será adotado em caso de suspeita de acesso indevido?
- [PENDENTE] PWA precisa funcionar offline apenas como app shell ou também exibir última agenda carregada?
- [PENDENTE] Devemos registrar service worker também em `instalar.html`?
- [PENDENTE] Qual política de versionamento do `CACHE_NAME` será adotada por deploy?
- [PENDENTE] Qual commit/tag deve ser usado como referência de rollback manual?
- [PENDENTE] Publicar manualmente no Apps Script de produção o conteúdo atualizado de `google-sheets-template/apps-script.gs`.
- [PENDENTE] Executar teste fim a fim reserva -> Sheets -> admin após publicação do Apps Script.

## Assunções Proibidas

- Não assumir que alterações futuras no Apps Script de produção foram aplicadas sem conferir o arquivo versionado e o deploy publicado.
- Não assumir que a senha admin é segura por estar em prompt.
- Não assumir que CPF pode ser coletado/exibido sem política formal.
- Não assumir que `localStorage` pode armazenar dados críticos em produção.
- Não assumir que alteração de `APP_CONFIG` é permitida sem contrato explícito.
- Não assumir que mudança de nomes de arquivos (`styles.css`, `manifest.webmanifest`) é segura sem validar HTML e service worker.
- Não assumir que o cache PWA atualiza automaticamente sem testar.
- Não assumir que ofuscação/criptografia da senha no frontend substitui autenticação real.
- Não assumir que `faturado` está finalizado operacionalmente; a ação futura está confirmada como necessária, mas fora do escopo atual.
- Não assumir que validações do frontend bastam; regras críticas precisam ser avaliadas no Apps Script.
- Não assumir que exemplos fictícios podem ser substituídos por dados reais em documentação/templates.
- Não assumir que observações livres não conterão dados sensíveis.
- Não assumir que usuário instalado receberá atualização imediatamente após deploy.
- Não assumir que `instalar.html` registra service worker se não carregar `app.js`.
