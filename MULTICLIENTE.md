# MicroSaaS multi-cliente

Este projeto agora suporta mais de um cliente sem duplicar o frontend.

## Como selecionar cliente

- Producao 637: https://637.fisamtech.com
- Piloto Euphoria: https://euphoria.fisamtech.com
- Demo segundo cliente: index.html?client=demo
- Admin demo: admin/?client=demo
- Instalacao demo: instalar.html?client=demo

Em producao, o tenant deve ser definido pelo subdominio. O loader usa esta prioridade:

1. Mapa de hostname em config/clients.js
2. Subdominio fisamtech.com quando houver cliente registrado
3. Query string client apenas em localhost/preview
4. Cliente salvo em localStorage
5. Cliente padrao 637

Regra de produto: subdominio conhecido sempre vence configuracao salva no navegador. Isso evita que um teste em client=demo contamine a abertura de um dominio real.

## Arquivos de configuracao

- config/clients.js: registry de clientes, aliases por hostname e arquivo de config.
- config/637.config.js: configuracao real da 637 Cervejaria.
- config/demo.config.js: segundo cliente demonstrativo, sem Sheets/Webhook, usando modo local.
- config/euphoria.config.js: tenant inicial do Espaco Euphoria em modo piloto/local ate preencher dados reais.
- config/_client-template.config.js: base para abrir um cliente novo rapidamente.
- config/config-loader.js: carrega a configuracao correta antes de app.js.

## Criar um novo cliente

1. Copiar config/_client-template.config.js para config/<cliente>.config.js.
2. Ajustar client.id, nome, textos, cores, quadras, horarios, precos, WhatsApp, PIX, spreadsheetId, webhook, senha admin e chaves de storage.
3. Registrar o cliente em config/clients.js.
4. Se houver dominio proprio, incluir em hostnameMap.
5. Validar publico e admin com query client.

## Limites do modelo atual

Este e um bom passo para vender e demonstrar o produto, mas ainda nao e o modelo ideal de SaaS:

- Credenciais operacionais continuam no frontend.
- Senha admin hardcoded ainda e fraca.
- Cada cliente ainda depende de Google Sheets/Apps Script.
- Nao ha isolamento forte de tenant no backend.
- Nao ha auditoria centralizada, usuarios, permissoes ou cobranca.

## Uso recomendado agora

Para a reuniao, mostrar:

- 637 como cliente real.
- client=demo como prova de multi-cliente.
- Admin parametrizado por cliente.
- Proxima fase com Next.js + banco documentada em NEXTJS-DB-ROADMAP.md.

## Checklist de go-live

Use GO-LIVE-NOVO-CLIENTE.md quando o comercial fechar um cliente.
