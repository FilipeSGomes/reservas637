const APP_CONFIG = {
  googleSheetsApiKey: "",
  spreadsheetId: "1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc",
  appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbxAQeWPiF0Nhi0ZSJwMFKa7ni6YiMEX5KIfScXfYH0B5C4mwDh56GyIKmylj8UF28m2/exec",
  adminPassword: "637admin",
};

const CONFIG_SHEET_NAME = "config";
const sheetsUrl = `https://docs.google.com/spreadsheets/d/${APP_CONFIG.spreadsheetId}/gviz/tq?tqx=out:json`;

const COURTS = [
  { id: "BT1", name: "Beach Tennis 1", type: "Beach Tennis" },
  { id: "BT2", name: "Beach Tennis 2", type: "Beach Tennis" },
  { id: "TN1", name: "Tênis 1", type: "Tênis" },
  { id: "TN2", name: "Tênis 2", type: "Tênis" },
];

const LOCAL_STORAGE_KEY = "quadras-local-fallback";
const SETTINGS_STORAGE_KEY = "quadras-admin-settings";
const FULL_DAY_BLOCK_SENTINEL = "__FULL_DAY__";
const ADMIN_AUTH_STORAGE_KEY = "quadras-admin-auth";
const LAST_BOOKING_CONTACT_KEY = "quadras-last-booking-contact";

const DEFAULT_COPY = {
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
  pixWhatsAppMessage: "Olá! Segue comprovante da reserva:\nQuadra: {court}\nData: {date}\nHorário: {time}\nValor: {amount}",
  bookingNextText: "Escolher pagamento",
  bookingSubmitText: "Enviar solicitação",
  bookingReuseText: "Reservar novamente",
  confirmationEyebrow: "Solicitação enviada",
  confirmationTitle: "Resumo da sua reserva",
  confirmationCloseText: "Fechar",
};

const DEFAULT_SETTINGS = {
  pixKey: "pix@quadras.com",
  whatsappPhoneNumber: "5511944554650",
  pricingByCourt: {
    BT1: "R$ 80,00",
    BT2: "R$ 80,00",
    TN1: "R$ 100,00",
    TN2: "R$ 100,00",
  },
  openingStart: "07:00",
  openingEnd: "22:00",
  copy: { ...DEFAULT_COPY },
};

let loadingOverlayCounter = 0;
let loadingOverlayTimeoutId = null;
let lastModalTrigger = null;

const state = {
  selectedDate: getToday(),
  selectedSlot: null,
  reservations: [],
  blocks: [],
  adminEnabled: false,
  settings: readSettings(),
  pendingOperations: new Set(),
};

const elements = {
  dateInput: document.querySelector("#date-input"),
  statusBanner: document.querySelector("#status-banner"),
  quickSlot: document.querySelector("#quick-slot"),
  quickSlotTitle: document.querySelector("#quick-slot-title"),
  quickSlotMeta: document.querySelector("#quick-slot-meta"),
  quickSlotBookButton: document.querySelector("#quick-slot-book-button"),
  quickSlotEyebrow: document.querySelector("#quick-slot-eyebrow"),
  heroHoursTag: document.querySelector("#hero-hours-tag"),
  heroHoursRange: document.querySelector("#hero-hours-range"),
  heroHoursLabel: document.querySelector("#hero-hours-label"),
  heroHoursDescription: document.querySelector("#hero-hours-description"),
  scheduleEyebrow: document.querySelector("#schedule-eyebrow"),
  scheduleTitle: document.querySelector("#schedule-title"),
  bookingConfirmation: document.querySelector("#booking-confirmation"),
  bookingConfirmationEyebrow: document.querySelector("#booking-confirmation-eyebrow"),
  bookingConfirmationTitle: document.querySelector("#booking-confirmation-title"),
  bookingConfirmationMeta: document.querySelector("#booking-confirmation-meta"),
  bookingConfirmationNextStep: document.querySelector("#booking-confirmation-next-step"),
  bookingConfirmationClose: document.querySelector("#booking-confirmation-close"),
  bookingConfirmationRepeat: document.querySelector("#booking-confirmation-repeat"),
  scheduleGrid: document.querySelector("#schedule-grid"),
  refreshButton: document.querySelector("#refresh-button"),
  preBookingModal: document.querySelector("#pre-booking-modal"),
  preBookingEyebrow: document.querySelector("#pre-booking-eyebrow"),
  preBookingTitle: document.querySelector("#pre-booking-title"),
  preBookingAmountLabel: document.querySelector("#pre-booking-amount-label"),
  preBookingRules: document.querySelector("#pre-booking-rules"),
  preBookingAmount: document.querySelector("#pre-booking-amount"),
  closePreBookingButton: document.querySelector("#close-pre-booking-button"),
  cancelPreBookingButton: document.querySelector("#cancel-pre-booking-button"),
  continueBookingButton: document.querySelector("#continue-booking-button"),
  bookingModal: document.querySelector("#booking-modal"),
  bookingForm: document.querySelector("#booking-form"),
  bookingSlotTitle: document.querySelector("#booking-slot-title"),
  bookingRegistrationStep: document.querySelector("#booking-registration-step"),
  bookingPaymentStep: document.querySelector("#booking-payment-step"),
  bookingPaymentTitle: document.querySelector("#booking-payment-title"),
  bookingNextButton: document.querySelector("#booking-next-button"),
  bookingSubmitButton: document.querySelector("#booking-submit-button"),
  bookingReuseButton: document.querySelector("#booking-reuse-button"),
  pixPaymentBox: document.querySelector("#pix-payment-box"),
  pixWhatsappLink: document.querySelector("#pix-whatsapp-link"),
  bookingPixTitle: document.querySelector("#booking-pix-title"),
  bookingPixSubtitle: document.querySelector("#booking-pix-subtitle"),
  bookingBillingTitle: document.querySelector("#booking-billing-title"),
  bookingBillingSubtitle: document.querySelector("#booking-billing-subtitle"),
  bookingPixLabel: document.querySelector("#booking-pix-label"),
  bookingPixInstruction: document.querySelector("#booking-pix-instruction"),
  bookingBillingNotice: document.querySelector("#booking-billing-notice"),
  billingPaymentBox: document.querySelector("#billing-payment-box"),
  pixKey: document.querySelector("#pix-key"),
  pixAmount: document.querySelector("#pix-amount"),
  closeModalButton: document.querySelector("#close-modal-button"),
  cancelBookingButton: document.querySelector("#cancel-booking-button"),
  adminAccessButton: document.querySelector("#admin-access-button"),
  adminLogin: document.querySelector("#admin-login"),
  adminLoginForm: document.querySelector("#admin-login-form"),
  adminPasswordInput: document.querySelector("#admin-password-input"),
  adminExitButton: document.querySelector("#admin-exit-button"),
  adminRefreshButton: document.querySelector("#admin-refresh-button"),
  adminPanel: document.querySelector("#admin-panel"),
  adminReservations: document.querySelector("#admin-reservations"),
  operationsView: document.querySelector("#operations-view"),
  configView: document.querySelector("#config-view"),
  operationsViewButton: document.querySelector("#operations-view-button"),
  configViewButton: document.querySelector("#config-view-button"),
  configForm: document.querySelector("#config-form"),
  configStatus: document.querySelector("#config-status"),
  blockForm: document.querySelector("#block-form"),
  dayBlockForm: document.querySelector("#day-block-form"),
  settingsForm: document.querySelector("#settings-form"),
};

boot().catch((error) => {
  console.error(error);
});

async function boot() {
  ensureLoadingOverlay();
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;

  if (!isAdminRoute()) {
    registerServiceWorker();
  }
  elements.dateInput.min = getToday();
  elements.dateInput.value = state.selectedDate;
  if (elements.bookingForm) {
    elements.bookingForm.noValidate = true;
  }
  await loadSettingsFromSheet();
  applySettings();
  populateSelects();
  attachEvents();
  updateAdminRouteUI();
  updateBanner("Carregando agenda...");
  loadAgenda();
}

function attachEvents() {
  elements.dateInput.addEventListener("change", async (event) => {
    if (isPastDate(event.target.value)) {
      state.selectedDate = getToday();
      elements.dateInput.value = state.selectedDate;
      await loadAgenda();
      updateBanner("Reservas em datas passadas não estão disponíveis.", true);
      return;
    }

    state.selectedDate = event.target.value;
    await loadAgenda();
  });

  elements.refreshButton?.addEventListener("click", loadAgenda);
  elements.closePreBookingButton?.addEventListener("click", closePreBookingModal);
  elements.cancelPreBookingButton?.addEventListener("click", closePreBookingModal);
  elements.continueBookingButton?.addEventListener("click", continueToBookingForm);
  elements.closeModalButton?.addEventListener("click", closeModal);
  elements.cancelBookingButton?.addEventListener("click", closeModal);
  elements.bookingNextButton?.addEventListener("click", showPaymentStep);
  elements.bookingReuseButton?.addEventListener("click", reuseLastBookingContact);
  elements.bookingForm?.querySelector('[name="cpf"]')?.addEventListener("input", formatCpfInput);
  elements.bookingForm?.querySelector('[name="phone"]')?.addEventListener("input", formatPhoneInput);
  elements.bookingForm?.querySelectorAll('input[name="name"], input[name="phone"], input[name="cpf"]')?.forEach((input) => {
    input.addEventListener("input", () => clearFieldError(input.name));
  });
  elements.bookingForm?.querySelectorAll('[name="payment"]')?.forEach((input) => {
    input.addEventListener("change", updatePaymentView);
  });

  elements.bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (elements.bookingSubmitButton.classList.contains("hidden")) {
      showPaymentStep();
      return;
    }

    await submitBooking();
  });
  elements.quickSlotBookButton?.addEventListener("click", () => {
    const nextSlot = findNextAvailableSlot();
    if (!nextSlot) {
      updateBanner("No momento, não há horários livres para a data selecionada.", true);
      return;
    }
    openPreBookingModal(nextSlot.court, nextSlot.time);
  });
  elements.bookingConfirmationClose?.addEventListener("click", hideBookingConfirmation);
  elements.bookingConfirmationRepeat?.addEventListener("click", () => {
    hideBookingConfirmation();
    elements.scheduleGrid?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elements.preBookingModal?.addEventListener("close", onModalClosed);
  elements.bookingModal?.addEventListener("close", onModalClosed);
  document.addEventListener("keydown", handleEscape);

  elements.adminAccessButton?.addEventListener("click", toggleAdminAccess);
  elements.adminLoginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loginAdmin(event.currentTarget);
  });
  elements.adminExitButton?.addEventListener("click", disableAdmin);
  elements.adminRefreshButton?.addEventListener("click", refreshAdminReservations);

  elements.blockForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitRangeBlock(event.currentTarget);
  });
  elements.dayBlockForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitFullDayBlock(event.currentTarget);
  });
  elements.settingsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSettings(event.currentTarget);
  });
  elements.configForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCopySettings(event.currentTarget);
  });
  elements.operationsViewButton?.addEventListener("click", () => showAdminView("operations"));
  elements.configViewButton?.addEventListener("click", () => showAdminView("config"));
}

async function loadAgenda() {
  updateBanner("Atualizando horários disponíveis...");
  elements.quickSlot?.classList.add("loading");
  if (elements.quickSlotTitle) {
    elements.quickSlotTitle.textContent = (state.settings.copy || DEFAULT_SETTINGS.copy).quickSlotLoadingText;
  }
  const [reservationsResult, blocksResult] = await Promise.allSettled([
    fetchSheetRows("reservas"),
    fetchSheetRows("bloqueios"),
  ]);

  const localData = readLocalData();

  if (reservationsResult.status === "fulfilled") {
    state.reservations = reservationsResult.value.filter((row) => row.data === state.selectedDate);
  } else {
    console.error(reservationsResult.reason);
    state.reservations = localData.reservations.filter((row) => row.data === state.selectedDate);
  }

  if (blocksResult.status === "fulfilled") {
    state.blocks = blocksResult.value.filter((row) => row.data === state.selectedDate);
  } else {
    console.error(blocksResult.reason);
    state.blocks = localData.blocks.filter((row) => row.data === state.selectedDate);
  }

  renderSchedule();
  renderAdminReservations();
  renderQuickSlotCTA();
  elements.quickSlot?.classList.remove("loading");

  if (reservationsResult.status === "fulfilled" && blocksResult.status === "fulfilled") {
    updateBanner(
      APP_CONFIG.spreadsheetId
        ? `Agenda carregada para ${formatDate(state.selectedDate)}.`
        : "Modo local ativo. Configure Google Sheets e Apps Script em `app.js` para produção."
    );
    return;
  }

  if (reservationsResult.status === "rejected" && blocksResult.status === "rejected") {
    updateBanner("Instabilidade na conexão. Mostrando a agenda salva no aparelho, quando disponível.", true);
    return;
  }

  if (reservationsResult.status === "rejected") {
    updateBanner("Não conseguimos atualizar as reservas agora. Tente novamente em instantes.", true);
    return;
  }

  updateBanner("Não conseguimos atualizar os bloqueios agora. Tente novamente em instantes.", true);
}

async function loadSettingsFromSheet() {
  if (!APP_CONFIG.spreadsheetId) {
    return;
  }

  try {
    const rows = await fetchSheetRows(CONFIG_SHEET_NAME);
    if (!rows.length) {
      return;
    }
    state.settings = mergeSettings(DEFAULT_SETTINGS, configRowsToSettings(rows));
    storeSettingsCache(state.settings);
  } catch (error) {
    console.error(error);
  }
}

async function fetchSheetRows(sheetName) {
  if (!APP_CONFIG.spreadsheetId) {
    if (sheetName === CONFIG_SHEET_NAME) {
      return [];
    }
    return readLocalData()[sheetName === "reservas" ? "reservations" : "blocks"];
  }

  const url = `${sheetsUrl}&sheet=${encodeURIComponent(sheetName)}&cacheBust=${Date.now()}`;
  let payloadText = "";
  showLoading();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao ler aba ${sheetName}`);
    }
    payloadText = await response.text();
  } finally {
    hideLoading();
  }
  const payload = parseGvizResponse(payloadText);
  const rows = payload.table?.rows ?? [];
  if (sheetName === CONFIG_SHEET_NAME) {
    return rows
      .map((row) => ({
        key: getCellValue(row.c?.[0]),
        value: getCellValue(row.c?.[1]),
      }))
      .filter((row) => row.key);
  }
  if (sheetName === "reservas") {
    return rows.map((row) => ({
      data: normalizeSheetDate(row.c?.[0]),
      quadra: getCellValue(row.c?.[1]),
      horario: normalizeSheetTime(row.c?.[2]),
      nome: getCellValue(row.c?.[3]),
      telefone: getCellValue(row.c?.[4]),
      cpf: getCellValue(row.c?.[5]),
      status: normalizeReservationStatus(getCellValue(row.c?.[6])),
      pagamento: normalizePayment(getCellValue(row.c?.[7])),
      observacao: getCellValue(row.c?.[8]),
    })).filter((row) => row.data && row.quadra && row.horario);
  }

  return rows.map((row) => ({
    data: normalizeSheetDate(row.c?.[0]),
    quadra: getCellValue(row.c?.[1]),
    horario: normalizeSheetTime(row.c?.[2]),
    motivo: getCellValue(row.c?.[3]),
    tipo: getCellValue(row.c?.[4]) || "Manutenção",
  })).filter((row) => row.data && row.quadra && row.horario);
}

function configRowsToSettings(rows) {
  const next = {
    ...DEFAULT_SETTINGS,
    pricingByCourt: { ...DEFAULT_SETTINGS.pricingByCourt },
    copy: { ...DEFAULT_SETTINGS.copy },
  };

  rows.forEach((row) => {
    const key = String(row.key || "").trim();
    const value = String(row.value || "").trim();
    if (!key) {
      return;
    }

    if (key === "pixKey" || key === "openingStart" || key === "openingEnd") {
      next[key] = value || next[key];
      return;
    }

    if (key === "whatsappPhoneNumber") {
      next.whatsappPhoneNumber = normalizeWhatsAppPhoneStorage(value) || next.whatsappPhoneNumber;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(next.pricingByCourt, key)) {
      next.pricingByCourt[key] = value || next.pricingByCourt[key];
      return;
    }

    if (key.startsWith("copy.")) {
      const copyKey = key.slice(5);
      if (copyKey) {
        next.copy[copyKey] = value || next.copy[copyKey];
      }
    }
  });

  return next;
}

function mergeSettings(base, incoming) {
  return {
    ...base,
    ...incoming,
    pricingByCourt: { ...base.pricingByCourt, ...(incoming.pricingByCourt || {}) },
    copy: { ...base.copy, ...(incoming.copy || {}) },
  };
}

function storeSettingsCache(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function renderSchedule() {
  if (!elements.scheduleGrid) {
    return;
  }

  elements.scheduleGrid.innerHTML = "";
  const visibleHours = getCurrentHours().filter((time) => !isPastTimeSlot(state.selectedDate, time));

  const fullDayBlock = getFullDayBlock();
  if (fullDayBlock) {
    const message = document.createElement("article");
    message.className = "schedule-day-block";
    message.innerHTML = `
      <h3>Quadra indisponível neste dia</h3>
      <p>${fullDayBlock.motivo || "Bloqueio administrativo"}</p>
    `;
    elements.scheduleGrid.appendChild(message);
    return;
  }

  for (const court of COURTS) {
    const column = document.createElement("article");
    column.className = "schedule-column";

    const header = document.createElement("div");
    header.className = "schedule-column-header";
    header.innerHTML = `<h3>${court.id}</h3><p>${court.name}</p>`;

    const list = document.createElement("div");
    list.className = "slot-list";

    visibleHours.forEach((time) => {
      const slotState = getSlotState(court.id, time);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `slot-card ${slotState.status}`;
      card.disabled = slotState.status !== "available";
      card.setAttribute("aria-disabled", String(slotState.status !== "available"));
      if (
        state.selectedSlot &&
        state.selectedSlot.courtId === court.id &&
        state.selectedSlot.time === time
      ) {
        card.classList.add("selected");
      }
      card.innerHTML = `
        <span class="slot-card-top">
          <span class="slot-card-title">${time}</span>
          <span class="slot-card-status">${labelForStatus(slotState.status)}</span>
        </span>
        <span class="slot-card-meta">${slotState.description}</span>
      `;

      if (slotState.status === "available") {
        card.addEventListener("click", () => openPreBookingModal(court, time));
      }

      list.appendChild(card);
    });

    column.append(header, list);
    elements.scheduleGrid.appendChild(column);
  }
}

function getSlotState(courtId, time) {
  const block = state.blocks.find((entry) => entry.quadra === courtId && entry.horario === time);
  if (block) {
    return {
      status: blockStatusForType(block.tipo),
      description: `${block.tipo || "Bloqueado"}${block.motivo ? ` • ${block.motivo}` : ""}`,
    };
  }

  if (isPastTimeSlot(state.selectedDate, time)) {
    return {
      status: "unavailable",
      description: "Horário já passou",
    };
  }

  const reservation = findReservationForSlot(courtId, time);

  if (!reservation) {
    return {
      status: "available",
      description: "Toque para reservar",
    };
  }

  if (reservation.status === "confirmado") {
    return {
      status: "confirmed",
      description: "Horário indisponível",
    };
  }

  if (reservation.status === "faturado") {
    return {
      status: "billed",
      description: "Horário indisponível",
    };
  }

  return {
    status: "pending",
    description: "Aguardando confirmação do pagamento",
  };
}

function labelForStatus(status) {
  const labels = {
    available: "Disponível",
    unavailable: "Indisponível",
    pending: "Pendente",
    confirmed: "Confirmado",
    blocked: "Bloqueado",
    "blocked-aula": "Aula",
    "blocked-event": "Evento",
    "blocked-maintenance": "Manutenção",
    "blocked-dayuse": "Day use",
    billed: "Faturado",
  };
  return labels[status];
}

function openPreBookingModal(court, time) {
  if (isPastTimeSlot(state.selectedDate, time)) {
    updateBanner("Não é possível reservar horários que já passaram.", true);
    return;
  }

  state.selectedSlot = { courtId: court.id, courtName: court.name, time };
  renderSchedule();
  elements.preBookingTitle.textContent = `${court.name} • ${formatDate(state.selectedDate)} • ${time}`;
  elements.preBookingAmount.textContent = state.settings.pricingByCourt[court.id] ?? "Consulte";
  lastModalTrigger = document.activeElement;
  document.body.classList.add("modal-open");
  elements.preBookingModal?.showModal();
  elements.continueBookingButton?.focus();
}

function closePreBookingModal() {
  state.selectedSlot = null;
  renderSchedule();
  elements.preBookingModal?.close();
}

function continueToBookingForm() {
  if (!state.selectedSlot) {
    return;
  }

  elements.preBookingModal?.close();
  elements.bookingSlotTitle.textContent =
    `${state.selectedSlot.courtName} • ${formatDate(state.selectedDate)} • ${state.selectedSlot.time}`;
  elements.bookingForm?.reset();
  showRegistrationStep();
  elements.pixKey.textContent = state.settings.pixKey;
  elements.pixAmount.textContent = state.settings.pricingByCourt[state.selectedSlot.courtId] ?? "Consulte";
  updatePaymentView();
  lastModalTrigger = document.activeElement;
  document.body.classList.add("modal-open");
  elements.bookingModal?.showModal();
  elements.bookingForm?.elements?.name?.focus();
}

function closeModal() {
  state.selectedSlot = null;
  renderSchedule();
  elements.bookingModal?.close();
}

function showRegistrationStep() {
  elements.bookingRegistrationStep.classList.remove("hidden");
  elements.bookingPaymentStep.classList.add("hidden");
  elements.bookingNextButton.classList.remove("hidden");
  elements.bookingSubmitButton.classList.add("hidden");
}

function showPaymentStep() {
  if (!validateRegistrationFields()) {
    return;
  }

  elements.bookingRegistrationStep.classList.add("hidden");
  elements.bookingPaymentStep.classList.remove("hidden");
  elements.bookingNextButton.classList.add("hidden");
  elements.bookingSubmitButton.classList.remove("hidden");
}

function updatePaymentView() {
  const payment = getSelectedPayment();
  elements.pixPaymentBox.classList.toggle("hidden", payment !== "pix");
  elements.billingPaymentBox.classList.toggle("hidden", payment !== "faturamento");
  updatePixWhatsappLink();
}

async function submitBooking() {
  if (!state.selectedSlot) {
    return;
  }

  if (isPastDate(state.selectedDate)) {
    state.selectedDate = getToday();
    elements.dateInput.value = state.selectedDate;
    closeModal();
    await loadAgenda();
    updateBanner("Não é possível reservar uma data passada.", true);
    return;
  }

  if (isPastTimeSlot(state.selectedDate, state.selectedSlot.time)) {
    closeModal();
    await loadAgenda();
    updateBanner("Não é possível reservar horários que já passaram.", true);
    return;
  }

  const formData = new FormData(elements.bookingForm);
  const pagamento = String(formData.get("payment") || "pix");
  const booking = {
    data: state.selectedDate,
    quadra: state.selectedSlot.courtId,
    horario: state.selectedSlot.time,
    nome: String(formData.get("name") || "").trim(),
    telefone: String(formData.get("phone") || "").trim(),
    cpf: String(formData.get("cpf") || "").trim(),
    status: pagamento === "faturamento" ? "faturado" : "pendente",
    pagamento,
    observacao: String(formData.get("observation") || "").trim(),
  };
  const operationKey = `reservation:create:${booking.data}:${booking.quadra}:${booking.horario}`;

  if (!validateRegistrationFields()) {
    updateBanner("Revise os campos obrigatórios para continuar.", true);
    return;
  }

  if (findReservationForSlot(booking.quadra, booking.horario)) {
    updateBanner("Esse horário acabou de ser reservado. Escolha outro horário disponível.", true);
    return;
  }

  if (!startPendingOperation(operationKey)) {
    updateBanner("Estamos finalizando seu pedido. Aguarde só um instante.", true);
    return;
  }

  setButtonLoading(elements.bookingSubmitButton, true, "Enviando...");

  try {
    await submitMutation("reservation:create", booking, ({ reservations, blocks }) => ({
      reservations: [...reservations, booking],
      blocks,
    }));
    saveLastBookingContact(booking);

    closeModal();
    await loadAgenda();
    showBookingConfirmation(booking);
    updateBanner(
      booking.status === "faturado"
        ? `Reserva faturada para ${booking.quadra} às ${booking.horario}.`
        : `Pedido enviado para ${booking.quadra} às ${booking.horario}. Agora é só enviar o comprovante PIX.`
    );
  } catch (error) {
    console.error(error);
    updateFriendlyError(error, "Nao foi possivel confirmar o envio da reserva.");
  } finally {
    finishPendingOperation(operationKey);
    setButtonLoading(elements.bookingSubmitButton, false);
  }
}

async function toggleAdminAccess() {
  if (state.adminEnabled) {
    disableAdmin();
    return;
  }

  const password = window.prompt("Senha do admin:");
  if (password !== APP_CONFIG.adminPassword) {
    updateBanner("Senha inválida para acesso ao painel admin.", true);
    return;
  }

  state.adminEnabled = true;
  elements.adminPanel?.classList.remove("hidden");
  elements.adminPanel?.setAttribute("aria-hidden", "false");
  await refreshAdminReservations("Painel admin liberado para a data selecionada.");
}

async function loginAdmin(form) {
  const formData = new FormData(form);
  const password = String(formData.get("password") || "");
  if (password !== APP_CONFIG.adminPassword) {
    updateBanner("Senha inválida para acesso ao painel admin.", true);
    return;
  }

  localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "1");
  state.adminEnabled = true;
  updateAdminRouteUI();
  await refreshAdminReservations("Painel admin liberado para a data selecionada.");
}

async function refreshAdminReservations(successMessage = "Pendências atualizadas para a data selecionada.") {
  if (!state.adminEnabled) {
    return;
  }

  setButtonLoading(elements.adminRefreshButton, true, "Atualizando...");
  try {
    await loadAgenda();
    updateBanner(successMessage);
  } finally {
    setButtonLoading(elements.adminRefreshButton, false);
  }
}

function countPendingReservations() {
  return state.reservations.filter((reservation) => reservation.status === "pendente").length;
}

function disableAdmin() {
  state.adminEnabled = false;
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  if (elements.adminPanel) {
    elements.adminPanel.classList.add("hidden");
    elements.adminPanel.setAttribute("aria-hidden", "true");
  }
  if (elements.adminLogin) {
    elements.adminLogin.classList.remove("hidden");
    elements.adminLogin.setAttribute("aria-hidden", "false");
  }
}

function renderAdminReservations() {
  if (!elements.adminReservations) {
    return;
  }

  if (!state.adminEnabled) {
    elements.adminReservations.innerHTML =
      "<p class='fine-print'>Desbloqueie o painel admin para ver os dados do dia.</p>";
    return;
  }

  const dayItems = [...state.reservations].sort((a, b) => {
    const pendingOrder = Number(b.status === "pendente") - Number(a.status === "pendente");
    return pendingOrder || a.horario.localeCompare(b.horario) || a.quadra.localeCompare(b.quadra);
  });

  if (!dayItems.length) {
    elements.adminReservations.innerHTML =
      "<p class='fine-print'>Nenhuma reserva registrada para esta data.</p>";
    return;
  }

  elements.adminReservations.innerHTML = "";
  const pendingCount = countPendingReservations();
  const summary = document.createElement("p");
  summary.className = "fine-print";
  summary.textContent =
    pendingCount === 1 ? "1 reserva pendente de confirmação." : `${pendingCount} reservas pendentes de confirmação.`;
  elements.adminReservations.appendChild(summary);

  dayItems.forEach((reservation) => {
    const item = document.createElement("article");
    item.className = "admin-item";
    item.innerHTML = `
      <div class="admin-item-top">
        <strong>${reservation.quadra} • ${reservation.horario}</strong>
        <span>${labelForStatus(
          reservation.status === "confirmado"
            ? "confirmed"
            : reservation.status === "faturado"
              ? "billed"
              : "pending"
        )}</span>
      </div>
      <p class="admin-item-meta">
        ${reservation.nome} • ${reservation.telefone}
        ${reservation.cpf ? ` • CPF ${reservation.cpf}` : ""}
      </p>
      <p class="admin-item-meta">
        Pagamento: ${reservation.pagamento || "pix"}
        ${reservation.observacao ? ` • ${reservation.observacao}` : ""}
      </p>
    `;

    if (reservation.status === "pendente") {
      const actions = document.createElement("div");
      actions.className = "admin-item-actions";

      const confirmButton = document.createElement("button");
      confirmButton.className = "mini-button";
      confirmButton.type = "button";
      confirmButton.textContent = "Confirmar PIX";
      confirmButton.addEventListener("click", async () => {
        await confirmReservation(reservation, confirmButton);
      });

      actions.appendChild(confirmButton);
      item.appendChild(actions);
    }

    elements.adminReservations.appendChild(item);
  });
}

async function confirmReservation(reservation, button) {
  const operationKey = `reservation:confirm:${reservation.data}:${reservation.quadra}:${reservation.horario}:${reservation.telefone}`;
  if (!startPendingOperation(operationKey)) {
    updateBanner("Confirmação em andamento. Aguarde um instante.", true);
    return;
  }

  const updatedReservation = { ...reservation, status: "confirmado" };
  setButtonLoading(button, true, "Confirmando...");

  try {
    await submitMutation(
      "reservation:confirm",
      updatedReservation,
      ({ reservations, blocks }) => ({
        reservations: reservations.map((entry) =>
          isSameReservation(entry, reservation) ? updatedReservation : entry
        ),
        blocks,
      })
    );

    await loadAgenda();
    updateBanner(`Reserva ${reservation.quadra} às ${reservation.horario} confirmada.`);
  } catch (error) {
    console.error(error);
    updateFriendlyError(error, "Nao foi possivel confirmar o PIX.");
  } finally {
    finishPendingOperation(operationKey);
    setButtonLoading(button, false);
  }
}

async function submitRangeBlock(form) {
  const formData = new FormData(form);
  const court = String(formData.get("court"));
  const startTime = String(formData.get("startTime"));
  const endTime = String(formData.get("endTime"));
  const tipo = String(formData.get("type") || "Manutenção");
  const motivo = String(formData.get("reason") || "").trim();

  const startIndex = getCurrentHours().indexOf(startTime);
  const endIndex = getCurrentHours().indexOf(endTime);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    updateBanner("Selecione uma faixa de horário válida.", true);
    return;
  }

  const slotsToBlock = getCurrentHours().slice(startIndex, endIndex + 1);
  for (const horario of slotsToBlock) {
    const reservation = findReservationForSlot(court, horario);
    if (reservation) {
      updateBanner(
        `Nao foi possivel bloquear ${court} às ${horario}: já existe reserva no período.`,
        true
      );
      return;
    }
  }

  const operationKey = `block:range:${state.selectedDate}:${court}:${startTime}:${endTime}`;
  if (!startPendingOperation(operationKey)) {
    updateBanner("Registrando bloqueio. Aguarde um instante.", true);
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true, "Registrando...");

  try {
    for (const horario of slotsToBlock) {
      const block = { data: state.selectedDate, quadra: court, horario, motivo, tipo };
      await submitMutation("block:create", block, ({ reservations, blocks }) => ({
        reservations,
        blocks: [...blocks, block],
      }));
    }

    form.reset();
    await loadAgenda();
    updateBanner(`Bloqueio registrado para ${court} de ${startTime} até ${endTime}.`);
  } catch (error) {
    console.error(error);
    updateFriendlyError(error, "Nao foi possivel confirmar o bloqueio.");
  } finally {
    finishPendingOperation(operationKey);
    setButtonLoading(submitButton, false);
  }
}

async function submitFullDayBlock(form) {
  const formData = new FormData(form);
  const block = {
    data: state.selectedDate,
    quadra: "ALL",
    horario: FULL_DAY_BLOCK_SENTINEL,
    motivo: String(formData.get("reason") || "").trim(),
    tipo: String(formData.get("type") || "Manutenção"),
  };
  const operationKey = `block:full-day:${block.data}`;
  if (!startPendingOperation(operationKey)) {
    updateBanner("Registrando bloqueio do dia. Aguarde um instante.", true);
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true, "Registrando...");
  try {
    await submitMutation("block:create", block, ({ reservations, blocks }) => ({
      reservations,
      blocks: [...blocks, block],
    }));
    form.reset();
    await loadAgenda();
    updateBanner("Dia inteiro bloqueado com sucesso.");
  } catch (error) {
    console.error(error);
    updateFriendlyError(error, "Nao foi possivel confirmar o bloqueio de dia inteiro.");
  } finally {
    finishPendingOperation(operationKey);
    setButtonLoading(submitButton, false);
  }
}

async function submitMutation(action, payload, fallbackUpdater) {
  if (APP_CONFIG.appsScriptWebhookUrl) {
    let response;
    let result;
    showLoading();
    try {
      response = await fetch(APP_CONFIG.appsScriptWebhookUrl, {
        method: "POST",
        body: JSON.stringify({ action, payload }),
      });
      result = await response.json().catch(() => null);
    } finally {
      hideLoading();
    }

    if (!response.ok) {
      throw new Error("Falha ao enviar webhook do Apps Script");
    }

    if (result && result.ok === false) {
      throw new Error(result.error || "Webhook do Apps Script recusou a operacao");
    }

    return result;
  }

  const stored = readLocalData();
  if (typeof fallbackUpdater === "function") {
    const updated = fallbackUpdater(stored);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}

function populateSelects() {
  if (!elements.blockForm) {
    return;
  }
  const courtSelect = elements.blockForm.querySelector('select[name="court"]');
  const startTimeSelect = elements.blockForm.querySelector('select[name="startTime"]');
  const endTimeSelect = elements.blockForm.querySelector('select[name="endTime"]');

  courtSelect.innerHTML = COURTS.map(
    (court) => `<option value="${court.id}">${court.id} • ${court.name}</option>`
  ).join("");

  const options = getCurrentHours().map((time) => `<option value="${time}">${time}</option>`).join("");
  startTimeSelect.innerHTML = options;
  endTimeSelect.innerHTML = options;
}

function readLocalData() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return {
      reservations: [],
      blocks: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      reservations: parsed.reservations ?? [],
      blocks: parsed.blocks ?? [],
    };
  } catch (error) {
    console.error(error);
    return {
      reservations: [],
      blocks: [],
    };
  }
}

function updateBanner(message, isError = false) {
  elements.statusBanner.textContent = message;
  elements.statusBanner.classList.toggle("error", isError);
}

function startPendingOperation(key) {
  if (state.pendingOperations.has(key)) {
    return false;
  }

  state.pendingOperations.add(key);
  return true;
}

function finishPendingOperation(key) {
  state.pendingOperations.delete(key);
}

function setButtonLoading(button, isLoading, loadingText = "") {
  if (!button) {
    return;
  }

  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.defaultText;
}

function isSameReservation(left, right) {
  return (
    left.data === right.data &&
    left.quadra === right.quadra &&
    left.horario === right.horario &&
    left.telefone === right.telefone
  );
}

function findReservationForSlot(courtId, time) {
  return state.reservations.find((entry) => entry.quadra === courtId && entry.horario === time);
}

function parseGvizResponse(payloadText) {
  const start = payloadText.indexOf("{");
  const end = payloadText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Resposta invalida do Google Sheets");
  }

  return JSON.parse(payloadText.slice(start, end + 1));
}

function getCellValue(cell) {
  if (!cell) {
    return "";
  }

  return String(cell.f ?? cell.v ?? "").trim();
}

function normalizeSheetDate(cell) {
  const value = getCellValue(cell);
  const dateMatch = value.match(/^Date\((\d+),(\d+),(\d+)\)$/);
  if (dateMatch) {
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]) + 1;
    const day = Number(dateMatch[3]);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const brDateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brDateMatch) {
    return `${brDateMatch[3]}-${brDateMatch[2].padStart(2, "0")}-${brDateMatch[1].padStart(2, "0")}`;
  }

  return value;
}

function normalizeSheetTime(cell) {
  const value = getCellValue(cell);
  const dateTimeMatch = value.match(/^Date\(\d+,\d+,\d+,(\d+),(\d+),?(\d+)?\)$/);
  if (dateTimeMatch) {
    return `${dateTimeMatch[1].padStart(2, "0")}:${dateTimeMatch[2].padStart(2, "0")}`;
  }

  const timeMatch = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeMatch) {
    return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  }

  return value;
}

function blockStatusForType(type) {
  const normalized = String(type || "").toLowerCase();
  if (normalized.startsWith("aula")) {
    return "blocked-aula";
  }
  if (normalized.includes("evento")) {
    return "blocked-event";
  }
  if (normalized.includes("manuten")) {
    return "blocked-maintenance";
  }
  if (normalized.includes("day use")) {
    return "blocked-dayuse";
  }
  return "blocked";
}

function normalizeReservationStatus(value) {
  const normalized = String(value || "pendente").trim().toLowerCase();
  if (["confirmado", "faturado", "pendente"].includes(normalized)) {
    return normalized;
  }

  return "pendente";
}

function normalizePayment(value) {
  const normalized = String(value || "pix").trim().toLowerCase();
  if (normalized === "faturamento") {
    return "faturamento";
  }

  return "pix";
}

function formatCpfInput(event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 11);
  const parts = [];

  if (digits.length > 0) {
    parts.push(digits.slice(0, 3));
  }
  if (digits.length > 3) {
    parts.push(digits.slice(3, 6));
  }
  if (digits.length > 6) {
    parts.push(digits.slice(6, 9));
  }

  event.target.value =
    parts.join(".") + (digits.length > 9 ? `-${digits.slice(9, 11)}` : "");
}

function formatPhoneInput(event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    event.target.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, ddd, prefix, suffix) =>
      suffix ? `(${ddd}) ${prefix}-${suffix}` : `(${ddd}) ${prefix}`
    );
    return;
  }
  event.target.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, ddd, prefix, suffix) =>
    suffix ? `(${ddd}) ${prefix}-${suffix}` : `(${ddd}) ${prefix}`
  );
}

function getSelectedPayment() {
  return String(new FormData(elements.bookingForm).get("payment") || "pix");
}

function getFullDayBlock() {
  return state.blocks.find((entry) => entry.horario === FULL_DAY_BLOCK_SENTINEL && entry.quadra === "ALL");
}

function isPastTimeSlot(date, time) {
  if (date !== getToday()) {
    return false;
  }
  const now = new Date();
  const [hour, minute] = String(time).split(":").map(Number);
  const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute || 0, 0, 0);
  return slotDate <= now;
}

function getCurrentHours() {
  const startHour = Number(state.settings.openingStart.split(":")[0]);
  const endHour = Number(state.settings.openingEnd.split(":")[0]);
  const length = Math.max(0, endHour - startHour + 1);
  return Array.from({ length }, (_, index) => `${String(startHour + index).padStart(2, "0")}:00`);
}

function formatOpeningHours(startTime, endTime) {
  const startLabel = String(startTime || "07:00").slice(0, 2);
  const endLabel = String(endTime || "22:00").slice(0, 2);
  return `${startLabel}h às ${endLabel}h`;
}

function readSettings() {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      pixKey: parsed.pixKey || DEFAULT_SETTINGS.pixKey,
      whatsappPhoneNumber: normalizeWhatsAppPhoneStorage(
        parsed.whatsappPhoneNumber || DEFAULT_SETTINGS.whatsappPhoneNumber
      ) || DEFAULT_SETTINGS.whatsappPhoneNumber,
      pricingByCourt: { ...DEFAULT_SETTINGS.pricingByCourt, ...(parsed.pricingByCourt || {}) },
      openingStart: parsed.openingStart || DEFAULT_SETTINGS.openingStart,
      openingEnd: parsed.openingEnd || DEFAULT_SETTINGS.openingEnd,
      copy: { ...DEFAULT_SETTINGS.copy, ...(parsed.copy || {}) },
    };
  } catch (error) {
    console.error(error);
    return { ...DEFAULT_SETTINGS };
  }
}

function applySettings() {
  const copy = state.settings.copy || DEFAULT_SETTINGS.copy;
  if (elements.pixKey) {
    elements.pixKey.textContent = state.settings.pixKey;
  }
  if (elements.quickSlotEyebrow) {
    elements.quickSlotEyebrow.textContent = copy.quickSlotEyebrow;
  }
  if (elements.heroHoursLabel) {
    elements.heroHoursLabel.textContent = copy.heroHoursLabel;
  }
  if (elements.heroHoursDescription) {
    elements.heroHoursDescription.textContent = copy.heroHoursDescription;
  }
  if (elements.scheduleEyebrow) {
    elements.scheduleEyebrow.textContent = copy.scheduleEyebrow;
  }
  if (elements.scheduleTitle) {
    elements.scheduleTitle.textContent = copy.scheduleTitle;
  }
  if (elements.bookingConfirmationEyebrow) {
    elements.bookingConfirmationEyebrow.textContent = copy.confirmationEyebrow;
  }
  if (elements.preBookingEyebrow) {
    elements.preBookingEyebrow.textContent = copy.preBookingEyebrow;
  }
  if (elements.preBookingAmountLabel) {
    elements.preBookingAmountLabel.textContent = copy.preBookingAmountLabel;
  }
  if (elements.preBookingRules) {
    elements.preBookingRules.textContent = copy.preBookingRules;
  }
  if (elements.bookingPaymentTitle) {
    elements.bookingPaymentTitle.textContent = copy.bookingPaymentTitle;
  }
  if (elements.bookingPixTitle) {
    elements.bookingPixTitle.textContent = copy.bookingPixTitle;
  }
  if (elements.bookingPixSubtitle) {
    elements.bookingPixSubtitle.textContent = copy.bookingPixSubtitle;
  }
  if (elements.bookingBillingTitle) {
    elements.bookingBillingTitle.textContent = copy.bookingBillingTitle;
  }
  if (elements.bookingBillingSubtitle) {
    elements.bookingBillingSubtitle.textContent = copy.billingStatusText || copy.bookingBillingSubtitle;
  }
  if (elements.bookingPixLabel) {
    elements.bookingPixLabel.textContent = copy.bookingPixLabel;
  }
  if (elements.bookingPixInstruction) {
    elements.bookingPixInstruction.textContent = copy.bookingPixInstruction;
  }
  if (elements.bookingBillingNotice) {
    elements.bookingBillingNotice.textContent = copy.bookingBillingNotice;
  }
  if (elements.quickSlotBookButton) {
    elements.quickSlotBookButton.textContent = copy.quickSlotButtonText;
  }
  if (elements.continueBookingButton) {
    elements.continueBookingButton.textContent = copy.continueBookingText;
  }
  if (elements.bookingNextButton) {
    elements.bookingNextButton.textContent = copy.bookingNextText;
  }
  if (elements.bookingSubmitButton) {
    elements.bookingSubmitButton.textContent = copy.bookingSubmitText;
  }
  if (elements.bookingReuseButton) {
    elements.bookingReuseButton.textContent = copy.bookingReuseText;
  }
  if (elements.bookingConfirmationClose) {
    elements.bookingConfirmationClose.textContent = copy.confirmationCloseText;
  }
  if (elements.bookingConfirmationRepeat) {
    elements.bookingConfirmationRepeat.textContent = copy.bookingReuseText;
  }
  const openingHours = formatOpeningHours(state.settings.openingStart, state.settings.openingEnd);
  if (elements.heroHoursTag) {
    elements.heroHoursTag.textContent = openingHours;
  }
  if (elements.heroHoursRange) {
    elements.heroHoursRange.textContent = openingHours;
  }
  fillSettingsForm();
  fillConfigForm();
}

function fillSettingsForm() {
  if (!elements.settingsForm) {
    return;
  }
  elements.settingsForm.elements.pixKey.value = state.settings.pixKey;
  elements.settingsForm.elements.whatsappPhoneNumber.value = state.settings.whatsappPhoneNumber;
  elements.settingsForm.elements.BT1.value = currencyToNumber(state.settings.pricingByCourt.BT1);
  elements.settingsForm.elements.BT2.value = currencyToNumber(state.settings.pricingByCourt.BT2);
  elements.settingsForm.elements.TN1.value = currencyToNumber(state.settings.pricingByCourt.TN1);
  elements.settingsForm.elements.TN2.value = currencyToNumber(state.settings.pricingByCourt.TN2);
  elements.settingsForm.elements.openingStart.value = state.settings.openingStart;
  elements.settingsForm.elements.openingEnd.value = state.settings.openingEnd;
}

function fillConfigForm() {
  if (!elements.configForm) {
    return;
  }
  const copy = state.settings.copy || DEFAULT_SETTINGS.copy;
  const fields = [
    "quickSlotEyebrow",
    "quickSlotLoadingText",
    "quickSlotEmptyTitle",
    "quickSlotEmptyMeta",
    "quickSlotButtonText",
    "heroHoursLabel",
    "heroHoursDescription",
    "scheduleEyebrow",
    "scheduleTitle",
    "bookingPixLabel",
    "bookingPixTitle",
    "bookingPixSubtitle",
    "bookingPixInstruction",
    "bookingBillingTitle",
    "bookingBillingSubtitle",
    "bookingBillingNotice",
    "billingStatusText",
    "pixWhatsAppMessage",
    "bookingNextText",
    "bookingSubmitText",
    "bookingReuseText",
    "confirmationEyebrow",
    "confirmationTitle",
    "confirmationCloseText",
  ];

  fields.forEach((field) => {
    if (elements.configForm.elements[field]) {
      elements.configForm.elements[field].value = copy[field] || "";
    }
  });
}

function findNextAvailableSlot() {
  for (const time of getCurrentHours()) {
    if (isPastTimeSlot(state.selectedDate, time)) {
      continue;
    }
    for (const court of COURTS) {
      const slotState = getSlotState(court.id, time);
      if (slotState.status === "available") {
        return { court, time };
      }
    }
  }
  return null;
}

function renderQuickSlotCTA() {
  if (!elements.quickSlot || !elements.quickSlotTitle || !elements.quickSlotMeta || !elements.quickSlotBookButton) {
    return;
  }
  const copy = state.settings.copy || DEFAULT_SETTINGS.copy;
  const nextSlot = findNextAvailableSlot();
  if (!nextSlot) {
    elements.quickSlotTitle.textContent = copy.quickSlotEmptyTitle;
    elements.quickSlotMeta.textContent = copy.quickSlotEmptyMeta;
    elements.quickSlotBookButton.disabled = true;
    return;
  }
  elements.quickSlotTitle.textContent = `${nextSlot.court.name} às ${nextSlot.time}`;
  elements.quickSlotMeta.textContent = `Data ${formatDate(state.selectedDate)} • reserve em 1 clique.`;
  elements.quickSlotBookButton.disabled = false;
}

function showAdminView(viewName) {
  const isConfig = viewName === "config";
  elements.operationsView?.classList.toggle("hidden", isConfig);
  elements.configView?.classList.toggle("hidden", !isConfig);
  elements.operationsViewButton?.classList.toggle("secondary-button", !isConfig);
  elements.operationsViewButton?.classList.toggle("ghost-button", isConfig);
  elements.configViewButton?.classList.toggle("secondary-button", isConfig);
  elements.configViewButton?.classList.toggle("ghost-button", !isConfig);
}

function saveLastBookingContact(booking) {
  const snapshot = {
    name: booking.nome || "",
    phone: booking.telefone || "",
  };
  localStorage.setItem(LAST_BOOKING_CONTACT_KEY, JSON.stringify(snapshot));
}

function reuseLastBookingContact() {
  if (!elements.bookingForm) {
    return;
  }
  const raw = localStorage.getItem(LAST_BOOKING_CONTACT_KEY);
  if (!raw) {
    updateBanner("Ainda não encontramos uma reserva anterior para preencher seus dados.", true);
    return;
  }
  try {
    const last = JSON.parse(raw);
    elements.bookingForm.elements.name.value = String(last.name || "");
    elements.bookingForm.elements.phone.value = String(last.phone || "");
    updateBanner("Pronto! Nome e telefone preenchidos com base na sua última reserva.");
  } catch (error) {
    console.error(error);
    updateBanner("Não foi possível reaproveitar os dados agora. Preencha manualmente.", true);
  }
}

function updatePixWhatsappLink() {
  if (!elements.pixWhatsappLink || !state.selectedSlot) {
    return;
  }
  const amount = state.settings.pricingByCourt[state.selectedSlot.courtId] ?? "Consulte";
  const template = (state.settings.copy || DEFAULT_SETTINGS.copy).pixWhatsAppMessage || DEFAULT_SETTINGS.copy.pixWhatsAppMessage;
  const normalizedTemplate = String(template).replace(/\\n/g, "\n");
  const message = normalizedTemplate
    .replace(/\{court\}/g, state.selectedSlot.courtId)
    .replace(/\{date\}/g, formatDate(state.selectedDate))
    .replace(/\{time\}/g, state.selectedSlot.time)
    .replace(/\{amount\}/g, amount);
  const phoneNumber = normalizeWhatsAppPhone(state.settings.whatsappPhoneNumber || DEFAULT_SETTINGS.whatsappPhoneNumber);
  const whatsappUrl = phoneNumber ? `https://wa.me/${phoneNumber}` : "https://wa.me/";
  elements.pixWhatsappLink.href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
}

function showBookingConfirmation(booking) {
  if (!elements.bookingConfirmation) {
    return;
  }
  const copy = state.settings.copy || DEFAULT_SETTINGS.copy;
  const statusText = booking.status === "faturado" ? "Solicitação em faturamento" : "Solicitação enviada (pendente de confirmação)";
  const nextStep = booking.status === "faturado"
    ? "Próximo passo: compareça no horário reservado e aproveite sua quadra."
    : "Próximo passo: envie o comprovante no WhatsApp para confirmar mais rápido.";
  if (elements.bookingConfirmationEyebrow) {
    elements.bookingConfirmationEyebrow.textContent = copy.confirmationEyebrow;
  }
  elements.bookingConfirmationTitle.textContent = `${copy.confirmationTitle} • ${booking.quadra} • ${booking.horario} • ${formatDate(booking.data)}`;
  elements.bookingConfirmationMeta.textContent = `Status: ${statusText}`;
  elements.bookingConfirmationNextStep.textContent = nextStep;
  elements.bookingConfirmation.classList.remove("hidden");
}

function hideBookingConfirmation() {
  elements.bookingConfirmation?.classList.add("hidden");
}

function updateFriendlyError(error, fallbackMessage) {
  const raw = String(error?.message || fallbackMessage || "");
  if (raw.toLowerCase().includes("network") || raw.toLowerCase().includes("fetch")) {
    updateBanner("Sua conexão oscilou. Tente novamente em alguns segundos.", true);
    return;
  }
  if (raw.toLowerCase().includes("webhook")) {
    updateBanner("Nosso sistema está instável no momento. Tente novamente em instantes.", true);
    return;
  }
  if (raw.toLowerCase().includes("horario") || raw.toLowerCase().includes("reserva")) {
    updateBanner("Esse horário acabou de mudar. Atualize a agenda e escolha outro disponível.", true);
    return;
  }
  updateBanner(`${fallbackMessage} Tente novamente em instantes.`, true);
}

async function saveSettings(form) {
  const formData = new FormData(form);
  const openingStart = String(formData.get("openingStart"));
  const openingEnd = String(formData.get("openingEnd"));
  if (openingStart >= openingEnd) {
    updateBanner("Horário de início deve ser menor que o horário de fim.", true);
    return;
  }
  state.settings = {
    pixKey: String(formData.get("pixKey") || "").trim(),
    whatsappPhoneNumber:
      normalizeWhatsAppPhoneStorage(formData.get("whatsappPhoneNumber")) || DEFAULT_SETTINGS.whatsappPhoneNumber,
    pricingByCourt: {
      BT1: numberToCurrency(String(formData.get("BT1") || "0")),
      BT2: numberToCurrency(String(formData.get("BT2") || "0")),
      TN1: numberToCurrency(String(formData.get("TN1") || "0")),
      TN2: numberToCurrency(String(formData.get("TN2") || "0")),
    },
    openingStart,
    openingEnd,
    copy: { ...state.settings.copy },
  };
  try {
    await submitMutation("config:update", { settings: state.settings }, () => null);
    storeSettingsCache(state.settings);
    await loadSettingsFromSheet();
    applySettings();
    populateSelects();
    await loadAgenda();
    updateBanner("Configurações salvas e aplicadas com sucesso.");
  } catch (error) {
    console.error(error);
    updateFriendlyError(error, "Nao foi possivel salvar as configuracoes.");
  }
}

async function saveCopySettings(form) {
  const formData = new FormData(form);
  const copy = {
    ...state.settings.copy,
    quickSlotEyebrow: String(formData.get("quickSlotEyebrow") || "").trim() || DEFAULT_SETTINGS.copy.quickSlotEyebrow,
    quickSlotLoadingText: String(formData.get("quickSlotLoadingText") || "").trim() || DEFAULT_SETTINGS.copy.quickSlotLoadingText,
    quickSlotEmptyTitle: String(formData.get("quickSlotEmptyTitle") || "").trim() || DEFAULT_SETTINGS.copy.quickSlotEmptyTitle,
    quickSlotEmptyMeta: String(formData.get("quickSlotEmptyMeta") || "").trim() || DEFAULT_SETTINGS.copy.quickSlotEmptyMeta,
    quickSlotButtonText: String(formData.get("quickSlotButtonText") || "").trim() || DEFAULT_SETTINGS.copy.quickSlotButtonText,
    heroHoursLabel: String(formData.get("heroHoursLabel") || "").trim() || DEFAULT_SETTINGS.copy.heroHoursLabel,
    heroHoursDescription: String(formData.get("heroHoursDescription") || "").trim() || DEFAULT_SETTINGS.copy.heroHoursDescription,
    scheduleEyebrow: String(formData.get("scheduleEyebrow") || "").trim() || DEFAULT_SETTINGS.copy.scheduleEyebrow,
    scheduleTitle: String(formData.get("scheduleTitle") || "").trim() || DEFAULT_SETTINGS.copy.scheduleTitle,
    bookingPixLabel: String(formData.get("bookingPixLabel") || "").trim() || DEFAULT_SETTINGS.copy.bookingPixLabel,
    bookingPixTitle: String(formData.get("bookingPixTitle") || "").trim() || DEFAULT_SETTINGS.copy.bookingPixTitle,
    bookingPixSubtitle: String(formData.get("bookingPixSubtitle") || "").trim() || DEFAULT_SETTINGS.copy.bookingPixSubtitle,
    bookingPixInstruction: String(formData.get("bookingPixInstruction") || "").trim() || DEFAULT_SETTINGS.copy.bookingPixInstruction,
    bookingBillingTitle: String(formData.get("bookingBillingTitle") || "").trim() || DEFAULT_SETTINGS.copy.bookingBillingTitle,
    bookingBillingSubtitle: String(formData.get("bookingBillingSubtitle") || "").trim() || DEFAULT_SETTINGS.copy.bookingBillingSubtitle,
    bookingBillingNotice: String(formData.get("bookingBillingNotice") || "").trim() || DEFAULT_SETTINGS.copy.bookingBillingNotice,
    billingStatusText: String(formData.get("billingStatusText") || "").trim() || DEFAULT_SETTINGS.copy.billingStatusText,
    pixWhatsAppMessage: String(formData.get("pixWhatsAppMessage") || "").trim() || DEFAULT_SETTINGS.copy.pixWhatsAppMessage,
    bookingNextText: String(formData.get("bookingNextText") || "").trim() || DEFAULT_SETTINGS.copy.bookingNextText,
    bookingSubmitText: String(formData.get("bookingSubmitText") || "").trim() || DEFAULT_SETTINGS.copy.bookingSubmitText,
    bookingReuseText: String(formData.get("bookingReuseText") || "").trim() || DEFAULT_SETTINGS.copy.bookingReuseText,
    confirmationEyebrow: String(formData.get("confirmationEyebrow") || "").trim() || DEFAULT_SETTINGS.copy.confirmationEyebrow,
    confirmationTitle: String(formData.get("confirmationTitle") || "").trim() || DEFAULT_SETTINGS.copy.confirmationTitle,
    confirmationCloseText: String(formData.get("confirmationCloseText") || "").trim() || DEFAULT_SETTINGS.copy.confirmationCloseText,
  };

  state.settings = {
    ...state.settings,
    copy,
  };

  try {
    await submitMutation("config:update", { settings: state.settings }, () => null);
    storeSettingsCache(state.settings);
    await loadSettingsFromSheet();
    applySettings();
    updateConfigStatus("Textos salvos e aplicados com sucesso.");
    updateBanner("Textos do app salvos com sucesso.");
  } catch (error) {
    console.error(error);
    updateConfigStatus("Nao foi possivel salvar os textos agora.");
    updateFriendlyError(error, "Nao foi possivel salvar os textos.");
  }
}

function numberToCurrency(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return "R$ 0,00";
  }
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function currencyToNumber(value) {
  const normalized = String(value || "").replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeWhatsAppPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.startsWith("55")) {
    return digits;
  }
  return `55${digits}`;
}

function normalizeWhatsAppPhoneStorage(value) {
  return String(value || "").replace(/\D/g, "");
}

function updateAdminRouteUI() {
  if (!isAdminRoute()) {
    return;
  }
  const isAuthenticated = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "1";
  state.adminEnabled = isAuthenticated;
  if (elements.adminPanel) {
    elements.adminPanel.classList.toggle("hidden", !isAuthenticated);
    elements.adminPanel.setAttribute("aria-hidden", String(!isAuthenticated));
  }
  if (elements.adminLogin) {
    elements.adminLogin.classList.toggle("hidden", isAuthenticated);
    elements.adminLogin.setAttribute("aria-hidden", String(isAuthenticated));
  }
  if (isAuthenticated) {
    showAdminView("operations");
  }
}

function updateConfigStatus(message) {
  if (elements.configStatus) {
    elements.configStatus.textContent = message;
  }
}

function isAdminRoute() {
  return window.location.pathname === "/admin" || window.location.pathname === "/admin/";
}

function ensureLoadingOverlay() {
  if (document.querySelector("#global-loading-overlay")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "global-loading-overlay";
  overlay.className = "global-loading-overlay hidden";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="global-loading-content" role="status" aria-live="polite" aria-label="Carregando">
      <svg class="loading-gear" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#ffffff" d="M36.8 2h-9.6l-1.2 7.5a23.2 23.2 0 0 0-5.6 2.3l-6.3-4.2-6.8 6.8 4.2 6.3a23.2 23.2 0 0 0-2.3 5.6L2 27.2v9.6l7.5 1.2a23.2 23.2 0 0 0 2.3 5.6l-4.2 6.3 6.8 6.8 6.3-4.2a23.2 23.2 0 0 0 5.6 2.3L27.2 62h9.6l1.2-7.5a23.2 23.2 0 0 0 5.6-2.3l6.3 4.2 6.8-6.8-4.2-6.3a23.2 23.2 0 0 0 2.3-5.6L62 36.8v-9.6l-7.5-1.2a23.2 23.2 0 0 0-2.3-5.6l4.2-6.3-6.8-6.8-6.3 4.2a23.2 23.2 0 0 0-5.6-2.3L36.8 2zm-4.8 17A13 13 0 1 1 19 32 13 13 0 0 1 32 19zm0 7.5a5.5 5.5 0 1 0 5.5 5.5 5.5 5.5 0 0 0-5.5-5.5z"/>
      </svg>
      <p>Aguarde...</p>
    </div>
  `;
  document.body.appendChild(overlay);
}

function showLoading() {
  loadingOverlayCounter += 1;
  const overlay = document.querySelector("#global-loading-overlay");
  if (!overlay) {
    return;
  }
  if (loadingOverlayTimeoutId) {
    clearTimeout(loadingOverlayTimeoutId);
  }
  loadingOverlayTimeoutId = window.setTimeout(() => {
    loadingOverlayCounter = 0;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    loadingOverlayTimeoutId = null;
  }, 10000);
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function hideLoading() {
  loadingOverlayCounter = Math.max(0, loadingOverlayCounter - 1);
  const overlay = document.querySelector("#global-loading-overlay");
  if (!overlay || loadingOverlayCounter > 0) {
    return;
  }
  if (loadingOverlayTimeoutId) {
    clearTimeout(loadingOverlayTimeoutId);
    loadingOverlayTimeoutId = null;
  }
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isPastDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value < getToday();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Falha ao registrar service worker", error);
    });
  });
}

function validateRegistrationFields() {
  if (!elements.bookingForm) {
    return true;
  }
  const name = elements.bookingForm.elements.name;
  const phone = elements.bookingForm.elements.phone;
  const cpf = elements.bookingForm.elements.cpf;
  let valid = true;

  if (!String(name.value || "").trim() || String(name.value || "").trim().length < 3) {
    setFieldError(name, "Informe seu nome completo.");
    valid = false;
  }

  const phoneDigits = String(phone.value || "").replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    setFieldError(phone, "Informe um telefone válido com DDD.");
    valid = false;
  }

  const cpfDigits = String(cpf.value || "").replace(/\D/g, "");
  if (cpfDigits.length !== 11) {
    setFieldError(cpf, "Informe um CPF válido com 11 números.");
    valid = false;
  }

  if (!valid) {
    const firstError = elements.bookingForm.querySelector(".field.has-error input");
    firstError?.focus();
  }
  return valid;
}

function setFieldError(input, message) {
  const field = input.closest(".field");
  if (!field) {
    return;
  }
  field.classList.add("has-error");
  const errorEl = field.querySelector(`.field-error[data-error-for="${input.name}"]`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearFieldError(name) {
  const input = elements.bookingForm?.elements?.[name];
  if (!input) {
    return;
  }
  const field = input.closest(".field");
  field?.classList.remove("has-error");
  const errorEl = field?.querySelector(`.field-error[data-error-for="${name}"]`);
  if (errorEl) {
    errorEl.textContent = "";
  }
}

function onModalClosed() {
  document.body.classList.remove("modal-open");
  if (lastModalTrigger && typeof lastModalTrigger.focus === "function") {
    lastModalTrigger.focus();
  }
}

function handleEscape(event) {
  if (event.key !== "Escape") {
    return;
  }
  if (elements.bookingModal?.open) {
    closeModal();
  }
  if (elements.preBookingModal?.open) {
    closePreBookingModal();
  }
}
