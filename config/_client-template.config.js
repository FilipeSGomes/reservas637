window.CLIENT_CONFIG = {
  client: {
    id: "cliente-id",
    name: "Nome do Cliente",
    shortName: "Cliente",
    timezone: "America/Sao_Paulo"
  },

  branding: {
    appName: "Reserva Cliente",
    pageTitle: "Nome do Cliente | Reserva de Quadras",
    installPageTitle: "Instalar app | Nome do Cliente",
    appleAppTitle: "Nome do Cliente",
    themeColor: "#245c4f",
    logoPath: "images/perfil637.jpg",
    logoAlt: "Logo do Nome do Cliente",
    favicon32: "icons/favicon-32.png",
    appleTouchIcon: "icons/apple-touch-icon.png",
    manifestPath: "manifest.webmanifest",
    primaryColor: "#245c4f",
    secondaryColor: "#e7f1ed"
  },

  contact: {
    whatsappPhoneNumber: "",
    pixKey: "",
    classWhatsappMessage: "Ola, gostaria de reservar uma aula.",
    pixReceiptMessage:
      "Ola! Segue comprovante da reserva:\nQuadra: {court}\nData: {date}\nHorario: {time}\nValor: {amount}"
  },

  businessHours: {
    openingStart: "07:00",
    openingEnd: "22:00",
    slotMinutes: 60
  },

  courts: [
    { id: "BT1", name: "Beach Tennis 1", type: "beach_tennis", active: true },
    { id: "BT2", name: "Beach Tennis 2", type: "beach_tennis", active: true },
    { id: "TN1", name: "Tenis 1", type: "tennis", active: false },
    { id: "TN2", name: "Tenis 2", type: "tennis", active: false }
  ],

  pricing: {
    currency: "BRL",
    defaultPrice: null,
    nightStart: "18:00",
    nightStartsAt: "18:00",
    updatedAt: "2026-05-26T16:35:00.000Z",
    byCourt: {
      BT1: { dayPrice: 80, nightPrice: 100 },
      BT2: { dayPrice: 80, nightPrice: 100 },
      TN1: { dayPrice: 100, nightPrice: 120 },
      TN2: { dayPrice: 100, nightPrice: 120 }
    }
  },

  payments: {
    pix: { enabled: true, statusOnCreate: "pendente", label: "PIX" },
    billing: { enabled: true, statusOnCreate: "faturado", label: "Faturamento" }
  },

  statuses: {
    available: "disponivel",
    pending: "pendente",
    confirmed: "confirmado",
    blocked: "bloqueado",
    billed: "faturado"
  },

  integrations: {
    googleSheetsApiKey: "",
    spreadsheetId: "",
    appsScriptWebhookUrl: ""
  },

  admin: {
    password: "trocar-antes-do-go-live",
    authStorageKey: "cliente-id-admin-auth"
  },

  storage: {
    reservationsKey: "cliente-id-reservas-local",
    blocksKey: "cliente-id-bloqueios-local",
    configCacheKey: "cliente-id-admin-settings",
    lastContactKey: "cliente-id-last-booking-contact"
  },

  texts: {
    heroEyebrow: "Nome do Cliente",
    heroTitle: "Reserve sua quadra online.",
    heroCopy: "Consulte horarios, escolha a quadra e envie sua solicitacao em poucos passos.",
    adminHeroEyebrow: "Nome do Cliente • Administracao",
    adminHeroTitle: "Painel administrativo das quadras.",
    adminHeroCopy: "Acesso restrito para gestao de reservas, bloqueios e configuracoes.",
    heroPrimaryCta: "Reservar quadra",
    installCta: "Adicionar a tela inicial",
    whatsappClassCta: "Falar com atendimento",
    quickSlotEyebrow: "Proximo horario livre",
    quickSlotLoadingText: "Buscando horarios disponiveis...",
    quickSlotEmptyTitle: "Sem horarios livres para este dia",
    quickSlotEmptyMeta: "Troque a data para ver os proximos horarios disponiveis.",
    quickSlotButtonText: "Reservar este horario",
    heroHoursLabel: "Horario de funcionamento",
    heroHoursDescription: "Blocos de 1 hora por quadra.",
    scheduleEyebrow: "Agenda",
    scheduleTitle: "Agenda por quadra e horario",
    preBookingEyebrow: "Pre-reserva",
    preBookingAmountLabel: "Valor da hora",
    preBookingRules:
      "Ao confirmar, voce concorda com as regras de uso da quadra. Cancelamentos devem ser feitos com antecedencia.",
    continueBookingText: "Continuar",
    bookingEyebrow: "Nova reserva",
    bookingPaymentTitle: "Forma de pagamento",
    bookingPixTitle: "PIX",
    bookingPixSubtitle: "Status pendente ate confirmacao do admin.",
    bookingBillingTitle: "Faturamento",
    bookingBillingSubtitle: "Lancamento para fechamento posterior.",
    bookingPixLabel: "Pagamento via PIX",
    bookingPixInstruction: "Envie o comprovante pelo WhatsApp.",
    bookingBillingNotice: "Reserva lancada para fechamento posterior.",
    billingStatusText: "Pagamento por faturamento.",
    bookingNextText: "Escolher pagamento",
    bookingSubmitText: "Enviar solicitacao",
    bookingReuseText: "Reservar novamente",
    confirmationEyebrow: "Solicitacao enviada",
    confirmationTitle: "Resumo da reserva",
    confirmationCloseText: "Fechar",
    installTitle: "Instale o app",
    installDescription: "Acesse a reserva direto pela tela inicial do celular.",
    installBackLink: "Voltar para reservas"
  }
};
