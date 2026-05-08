window.CLIENT_CONFIG = {
  client: {
    id: "637",
    name: "637 Cervejaria",
    shortName: "637",
    timezone: "America/Sao_Paulo"
  },

  branding: {
    appName: "Reserva 637",
    pageTitle: "637 Cervejaria | Reserva de Quadras",
    installPageTitle: "Instalar app | 637 Cervejaria",
    appleAppTitle: "637 Cervejaria",
    themeColor: "#676b2a",
    logoPath: "images/perfil637.jpg",
    logoAlt: "Logo da 637 Cervejaria",
    favicon32: "icons/favicon-32.png",
    appleTouchIcon: "icons/apple-touch-icon.png",
    manifestPath: "manifest.webmanifest",
    primaryColor: "#676b2a",
    secondaryColor: "#ece8d8"
  },

  contact: {
    whatsappPhoneNumber: "5511964809815",
    classWhatsappMessage: "Olá, gostaria de reservar uma aula.",
    pixReceiptMessage:
      "Olá! Segue comprovante da reserva:\\nQuadra: {court}\\nData: {date}\\nHorário: {time}\\nValor: {amount}"
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
      name: "Tênis 1",
      type: "tennis",
      active: true
    },
    {
      id: "TN2",
      name: "Tênis 2",
      type: "tennis",
      active: true
    }
  ],

  pricing: {
    currency: "BRL",
    defaultPrice: null,
    nightStart: "18:00",
    byCourt: {
      BT1: {
        dayPrice: 80,
        nightPrice: 80
      },
      BT2: {
        dayPrice: 80,
        nightPrice: 80
      },
      TN1: {
        dayPrice: 100,
        nightPrice: 100
      },
      TN2: {
        dayPrice: 100,
        nightPrice: 100
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
      label: "Faturamento"
    }
  },

  statuses: {
    available: "disponível",
    pending: "pendente",
    confirmed: "confirmado",
    blocked: "bloqueado",
    billed: "faturado"
  },

  integrations: {
    googleSheetsApiKey: "",
    spreadsheetId: "1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc",
    appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbxAQeWPiF0Nhi0ZSJwMFKa7ni6YiMEX5KIfScXfYH0B5C4mwDh56GyIKmylj8UF28m2/exec"
  },

  admin: {
    password: "637admin",
    authStorageKey: "quadras-admin-auth"
  },

  storage: {
    reservationsKey: "quadras-local-fallback",
    blocksKey: "bloqueios637",
    configCacheKey: "quadras-admin-settings",
    lastContactKey: "quadras-last-booking-contact"
  },

  texts: {
    heroEyebrow: "637 Cervejaria • Desde 2017",
    heroTitle: "Tênis, Beach Tennis e cerveja artesanal no mesmo lugar.",
    heroCopy:
      "Consulte a agenda do dia, escolha sua quadra e envie sua solicitação em menos de um minuto.",
    heroPrimaryCta: "Reservar quadra",
    installCta: "Adicionar à tela inicial",
    whatsappClassCta: "Reserve sua aula",
    quickSlotEyebrow: "Próximo horário livre",
    quickSlotLoadingText: "Buscando o melhor horário para você...",
    quickSlotEmptyTitle: "Sem horários livres para este dia",
    quickSlotEmptyMeta: "Troque a data para ver os próximos horários disponíveis.",
    quickSlotButtonText: "Reservar este horário",
    heroHoursLabel: "Horário de funcionamento",
    heroHoursDescription: "Blocos de 1 hora para Beach Tennis e Tênis.",
    scheduleEyebrow: "Grade visual",
    scheduleTitle: "Agenda por quadra e horário",
    preBookingEyebrow: "Pré-reserva",
    preBookingAmountLabel: "Valor da hora",
    preBookingRules:
      "Ao confirmar, você concorda com as regras de uso da quadra. Cancelamentos devem ser feitos com 2h de antecedência.",
    continueBookingText: "Continuar",
    bookingEyebrow: "Nova reserva",
    bookingPaymentTitle: "Forma de pagamento",
    bookingPixTitle: "PIX",
    bookingPixSubtitle: "Status pendente até confirmação do admin.",
    bookingBillingTitle: "Faturamento",
    bookingBillingSubtitle: "Pagamento no final do mês.",
    bookingPixLabel: "Pagamento via PIX",
    bookingPixInstruction: "Envie o comprovante pelo WhatsApp.",
    bookingBillingNotice: "Valor será lançado na sua conta. Pagamento no final do mês.",
    billingStatusText: "Pagamento no final do mês.",
    pixWhatsAppMessage:
      "Olá! Segue comprovante da reserva:\\nQuadra: {court}\\nData: {date}\\nHorário: {time}\\nValor: {amount}",
    bookingNextText: "Escolher pagamento",
    bookingSubmitText: "Enviar solicitação",
    bookingReuseText: "Reservar novamente",
    confirmationEyebrow: "Solicitação enviada",
    confirmationTitle: "Resumo da sua reserva",
    confirmationCloseText: "Fechar",
    previousReservationNotFound:
      "Ainda não encontramos uma reserva anterior para preencher seus dados.",
    adminInvalidPassword: "Senha inválida para acesso ao painel admin.",
    adminUnlocked: "Painel admin liberado para a data selecionada.",
    adminRefreshSuccess: "Pendências atualizadas para a data selecionada.",
    noReservationsForDate: "Nenhuma reserva registrada para esta data.",
    pendingReservationSingular: "1 reserva pendente de confirmação.",
    pendingReservationPlural: "{count} reservas pendentes de confirmação.",
    confirmPixButton: "Confirmar PIX",
    fullDayBlockedTitle: "Quadra indisponível neste dia",
    fullDayBlockedFallbackReason: "Bloqueio administrativo",
    genericBlockedReason: "Bloqueado",
    pastDateBlocked: "Não é possível reservar uma data passada.",
    pastTimeBlocked: "Não é possível reservar horários que já passaram.",
    slotAlreadyBooked: "Esse horário acabou de ser reservado. Escolha outro horário disponível.",
    reservationSubmitError: "Nao foi possivel confirmar o envio da reserva.",
    blockSubmitError: "Nao foi possivel confirmar o bloqueio.",
    fullDayBlockSubmitError: "Nao foi possivel confirmar o bloqueio de dia inteiro.",
    settingsSaved: "Configurações salvas e aplicadas com sucesso.",
    copySaved: "Textos do app salvos com sucesso.",
    pixKeyNotConfigured: "Chave PIX não configurada.",
    pixKeyCopied: "Chave PIX copiada.",
    installTitle: "Instale o app",
    installDescription: "Acesse a reserva de quadras direto pela tela inicial do celular.",
    installBackLink: "Voltar para reservas"
  }
};
