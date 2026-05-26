window.CLIENT_CONFIG = {
  client: {
    id: "demo",
    name: "Cliente Demo Sports",
    shortName: "Demo Sports",
    timezone: "America/Sao_Paulo"
  },

  branding: {
    appName: "Reserva Demo",
    pageTitle: "Cliente Demo Sports | Reserva de Quadras",
    installPageTitle: "Instalar app | Cliente Demo Sports",
    appleAppTitle: "Cliente Demo Sports",
    themeColor: "#245c4f",
    logoPath: "images/perfil637.jpg",
    logoAlt: "Logo do Cliente Demo Sports",
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
      "Ola! Segue comprovante da reserva:\\nQuadra: {court}\\nData: {date}\\nHorario: {time}\\nValor: {amount}"
  },

  businessHours: {
    openingStart: "07:00",
    openingEnd: "22:00",
    slotMinutes: 60
  },

  courts: [
    {
      id: "BT1",
      name: "Beach Tennis 1",
      type: "beach_tennis",
      active: true
    },
    {
      id: "BT2",
      name: "Beach Tennis 2",
      type: "beach_tennis",
      active: true
    },
    {
      id: "TN1",
      name: "Tenis 1",
      type: "tennis",
      active: true
    }
  ],

  pricing: {
    currency: "BRL",
    defaultPrice: null,
    nightStart: "18:00",
    nightStartsAt: "18:00",
    updatedAt: "2026-05-26T16:30:00.000Z",
    byCourt: {
      BT1: {
        dayPrice: 90,
        nightPrice: 120
      },
      BT2: {
        dayPrice: 90,
        nightPrice: 120
      },
      TN1: {
        dayPrice: 110,
        nightPrice: 140
      }
    }
  },

  payments: {
    pix: {
      enabled: true,
      statusOnCreate: "pendente",
      label: "PIX"
    },
    billing: {
      enabled: true,
      statusOnCreate: "faturado",
      label: "Mensalista"
    }
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
    password: "demo-admin",
    authStorageKey: "demo-admin-auth"
  },

  storage: {
    reservationsKey: "demo-reservas-local",
    blocksKey: "demo-bloqueios-local",
    configCacheKey: "demo-admin-settings",
    lastContactKey: "demo-last-booking-contact"
  },

  texts: {
    heroEyebrow: "Cliente Demo Sports",
    heroTitle: "Reservas online para clubes, arenas e quadras.",
    heroCopy:
      "Uma vitrine configuravel para agenda, pagamento, bloqueios e operacao de mais de uma unidade.",
    adminHeroEyebrow: "Cliente Demo Sports • Administracao",
    adminHeroTitle: "Operacao configuravel para multiplas quadras.",
    adminHeroCopy: "Painel demo para reservas, bloqueios e parametros do cliente.",
    heroPrimaryCta: "Ver agenda demo",
    installCta: "Adicionar app demo",
    whatsappClassCta: "Falar com atendimento",
    quickSlotEyebrow: "Proximo horario livre",
    quickSlotLoadingText: "Buscando horarios disponiveis...",
    quickSlotEmptyTitle: "Sem horarios livres para este dia",
    quickSlotEmptyMeta: "Troque a data para ver a agenda demo.",
    quickSlotButtonText: "Reservar horario demo",
    heroHoursLabel: "Horario de funcionamento",
    heroHoursDescription: "Agenda parametrizada por cliente.",
    scheduleEyebrow: "Agenda demo",
    scheduleTitle: "Quadras e horarios disponiveis",
    preBookingEyebrow: "Pre-reserva",
    preBookingAmountLabel: "Valor da hora",
    preBookingRules:
      "Esta e uma configuracao demonstrativa. Cada cliente pode ter regras, valores e canais proprios.",
    continueBookingText: "Continuar",
    bookingEyebrow: "Nova reserva",
    bookingPaymentTitle: "Forma de pagamento",
    bookingPixTitle: "PIX",
    bookingPixSubtitle: "Status pendente ate confirmacao.",
    bookingBillingTitle: "Mensalista",
    bookingBillingSubtitle: "Lancamento para fechamento mensal.",
    bookingPixLabel: "Pagamento via PIX",
    bookingPixInstruction: "Envie o comprovante pelo WhatsApp do cliente.",
    bookingBillingNotice: "Reserva lancada para fechamento mensal.",
    billingStatusText: "Pagamento mensalista.",
    bookingNextText: "Escolher pagamento",
    bookingSubmitText: "Enviar solicitacao",
    bookingReuseText: "Reservar novamente",
    confirmationEyebrow: "Solicitacao enviada",
    confirmationTitle: "Resumo da reserva",
    confirmationCloseText: "Fechar",
    installTitle: "Instale o app demo",
    installDescription: "Acesse a agenda configuravel direto da tela inicial.",
    installBackLink: "Voltar para agenda"
  }
};
