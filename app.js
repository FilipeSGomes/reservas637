const APP_CONFIG = {
  googleSheetsApiKey: "",
  spreadsheetId: "1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc",
  appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbxAQeWPiF0Nhi0ZSJwMFKa7ni6YiMEX5KIfScXfYH0B5C4mwDh56GyIKmylj8UF28m2/exec",
  adminPassword: "637admin",
  pixKey: "pix@quadras.com",
  pricingByCourt: {
    BT1: "R$ 80,00",
    BT2: "R$ 80,00",
    TN1: "R$ 100,00",
    TN2: "R$ 100,00",
  },
};

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

const DEFAULT_SETTINGS = {
  pixKey: APP_CONFIG.pixKey,
  pricingByCourt: {
    ...APP_CONFIG.pricingByCourt,
  },
  openingStart: "07:00",
  openingEnd: "22:00",
};

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
  scheduleGrid: document.querySelector("#schedule-grid"),
  refreshButton: document.querySelector("#refresh-button"),
  preBookingModal: document.querySelector("#pre-booking-modal"),
  preBookingTitle: document.querySelector("#pre-booking-title"),
  preBookingAmount: document.querySelector("#pre-booking-amount"),
  closePreBookingButton: document.querySelector("#close-pre-booking-button"),
  cancelPreBookingButton: document.querySelector("#cancel-pre-booking-button"),
  continueBookingButton: document.querySelector("#continue-booking-button"),
  bookingModal: document.querySelector("#booking-modal"),
  bookingForm: document.querySelector("#booking-form"),
  bookingSlotTitle: document.querySelector("#booking-slot-title"),
  bookingRegistrationStep: document.querySelector("#booking-registration-step"),
  bookingPaymentStep: document.querySelector("#booking-payment-step"),
  bookingNextButton: document.querySelector("#booking-next-button"),
  bookingSubmitButton: document.querySelector("#booking-submit-button"),
  pixPaymentBox: document.querySelector("#pix-payment-box"),
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
  blockForm: document.querySelector("#block-form"),
  dayBlockForm: document.querySelector("#day-block-form"),
  settingsForm: document.querySelector("#settings-form"),
};

boot();

function boot() {
  if (!isAdminRoute()) {
    registerServiceWorker();
  }
  elements.dateInput.min = getToday();
  elements.dateInput.value = state.selectedDate;
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
  elements.bookingForm?.querySelector('[name="cpf"]')?.addEventListener("input", formatCpfInput);
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
}

async function loadAgenda() {
  updateBanner("Atualizando grade...");
  try {
    const [reservations, blocks] = await Promise.all([
      fetchSheetRows("reservas"),
      fetchSheetRows("bloqueios"),
    ]);

    state.reservations = reservations.filter((row) => row.data === state.selectedDate);
    state.blocks = blocks.filter((row) => row.data === state.selectedDate);

    renderSchedule();
    renderAdminReservations();

    updateBanner(
      APP_CONFIG.spreadsheetId
        ? `Agenda carregada para ${formatDate(state.selectedDate)}.`
        : "Modo local ativo. Configure Google Sheets e Apps Script em `app.js` para produção."
    );
  } catch (error) {
    console.error(error);
    updateBanner("Falha ao carregar agenda. Usando dados locais quando disponíveis.", true);
    state.reservations = readLocalData().reservations.filter((row) => row.data === state.selectedDate);
    state.blocks = readLocalData().blocks.filter((row) => row.data === state.selectedDate);
    renderSchedule();
    renderAdminReservations();
  }
}

async function fetchSheetRows(sheetName) {
  if (!APP_CONFIG.spreadsheetId) {
    return readLocalData()[sheetName === "reservas" ? "reservations" : "blocks"];
  }

  const url = `${sheetsUrl}&sheet=${encodeURIComponent(sheetName)}&cacheBust=${Date.now()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao ler aba ${sheetName}`);
  }

  const payloadText = await response.text();
  const payload = parseGvizResponse(payloadText);
  const rows = payload.table?.rows ?? [];
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

function renderSchedule() {
  if (!elements.scheduleGrid) {
    return;
  }

  elements.scheduleGrid.innerHTML = "";

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

    getCurrentHours().forEach((time) => {
      const slotState = getSlotState(court.id, time);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `slot-card ${slotState.status}`;
      card.disabled = slotState.status !== "available";
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
      description: "Clique para reservar",
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
    description: "Aguardando confirmação",
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
  elements.preBookingTitle.textContent = `${court.name} • ${formatDate(state.selectedDate)} • ${time}`;
  elements.preBookingAmount.textContent = state.settings.pricingByCourt[court.id] ?? "Consulte";
  elements.preBookingModal?.showModal();
}

function closePreBookingModal() {
  state.selectedSlot = null;
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
  elements.bookingModal?.showModal();
}

function closeModal() {
  state.selectedSlot = null;
  elements.bookingModal?.close();
}

function showRegistrationStep() {
  elements.bookingRegistrationStep.classList.remove("hidden");
  elements.bookingPaymentStep.classList.add("hidden");
  elements.bookingNextButton.classList.remove("hidden");
  elements.bookingSubmitButton.classList.add("hidden");
}

function showPaymentStep() {
  if (!elements.bookingForm.reportValidity()) {
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

  if (!booking.nome || !booking.telefone || !booking.cpf) {
    updateBanner("Preencha nome, telefone e CPF antes de enviar a reserva.", true);
    return;
  }

  if (findReservationForSlot(booking.quadra, booking.horario)) {
    updateBanner("Este horário já possui uma reserva. Atualize a agenda e escolha outro horário.", true);
    return;
  }

  if (!startPendingOperation(operationKey)) {
    updateBanner("Reserva já está sendo enviada. Aguarde a confirmação.", true);
    return;
  }

  setButtonLoading(elements.bookingSubmitButton, true, "Enviando...");

  try {
    await submitMutation("reservation:create", booking, ({ reservations, blocks }) => ({
      reservations: [...reservations, booking],
      blocks,
    }));

    closeModal();
    await loadAgenda();
    updateBanner(
      booking.status === "faturado"
        ? `Reserva faturada para ${booking.quadra} às ${booking.horario}.`
        : `Reserva enviada para ${booking.quadra} às ${booking.horario}. Status pendente até confirmação do PIX.`
    );
  } catch (error) {
    console.error(error);
    updateBanner(
      "Nao foi possivel confirmar o envio da reserva. Atualize a agenda antes de tentar novamente.",
      true
    );
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
    updateBanner("Confirmação já está em andamento. Aguarde.", true);
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
    updateBanner("Nao foi possivel confirmar o PIX. Atualize a agenda antes de tentar novamente.", true);
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
    updateBanner("Bloqueio já está sendo registrado. Aguarde.", true);
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
    updateBanner(
      "Nao foi possivel confirmar o bloqueio. Atualize a agenda antes de tentar novamente.",
      true
    );
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
    updateBanner("Bloqueio de dia inteiro já está sendo registrado. Aguarde.", true);
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
    updateBanner("Nao foi possivel confirmar o bloqueio de dia inteiro.", true);
  } finally {
    finishPendingOperation(operationKey);
    setButtonLoading(submitButton, false);
  }
}

async function submitMutation(action, payload, fallbackUpdater) {
  if (APP_CONFIG.appsScriptWebhookUrl) {
    const response = await fetch(APP_CONFIG.appsScriptWebhookUrl, {
      method: "POST",
      body: JSON.stringify({ action, payload }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error("Falha ao enviar webhook do Apps Script");
    }

    if (result && result.ok === false) {
      throw new Error(result.error || "Webhook do Apps Script recusou a operacao");
    }

    return result;
  }

  const stored = readLocalData();
  const updated = fallbackUpdater(stored);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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

function readSettings() {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      pixKey: parsed.pixKey || DEFAULT_SETTINGS.pixKey,
      pricingByCourt: { ...DEFAULT_SETTINGS.pricingByCourt, ...(parsed.pricingByCourt || {}) },
      openingStart: parsed.openingStart || DEFAULT_SETTINGS.openingStart,
      openingEnd: parsed.openingEnd || DEFAULT_SETTINGS.openingEnd,
    };
  } catch (error) {
    console.error(error);
    return { ...DEFAULT_SETTINGS };
  }
}

function applySettings() {
  if (elements.pixKey) {
    elements.pixKey.textContent = state.settings.pixKey;
  }
  const heroStrong = document.querySelector(".hero-card strong");
  if (heroStrong) {
    heroStrong.textContent = `${state.settings.openingStart.slice(0, 2)}h às ${state.settings.openingEnd.slice(0, 2)}h`;
  }
  fillSettingsForm();
}

function fillSettingsForm() {
  if (!elements.settingsForm) {
    return;
  }
  elements.settingsForm.elements.pixKey.value = state.settings.pixKey;
  elements.settingsForm.elements.BT1.value = currencyToNumber(state.settings.pricingByCourt.BT1);
  elements.settingsForm.elements.BT2.value = currencyToNumber(state.settings.pricingByCourt.BT2);
  elements.settingsForm.elements.TN1.value = currencyToNumber(state.settings.pricingByCourt.TN1);
  elements.settingsForm.elements.TN2.value = currencyToNumber(state.settings.pricingByCourt.TN2);
  elements.settingsForm.elements.openingStart.value = state.settings.openingStart;
  elements.settingsForm.elements.openingEnd.value = state.settings.openingEnd;
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
    pricingByCourt: {
      BT1: numberToCurrency(String(formData.get("BT1") || "0")),
      BT2: numberToCurrency(String(formData.get("BT2") || "0")),
      TN1: numberToCurrency(String(formData.get("TN1") || "0")),
      TN2: numberToCurrency(String(formData.get("TN2") || "0")),
    },
    openingStart,
    openingEnd,
  };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
  applySettings();
  populateSelects();
  await loadAgenda();
  updateBanner("Configurações salvas e aplicadas com sucesso.");
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
}

function isAdminRoute() {
  return window.location.pathname === "/admin" || window.location.pathname === "/admin/";
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
