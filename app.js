const APP_CONFIG = {
  googleSheetsApiKey: "",
  spreadsheetId: "1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc",
  appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbxAQeWPiF0Nhi0ZSJwMFKa7ni6YiMEX5KIfScXfYH0B5C4mwDh56GyIKmylj8UF28m2/exec",
  adminPassword: "admin123",
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

const HOURS = Array.from({ length: 16 }, (_, index) => {
  const hour = index + 7;
  return `${String(hour).padStart(2, "0")}:00`;
});

const LOCAL_STORAGE_KEY = "quadras-local-fallback";

const state = {
  selectedDate: getToday(),
  selectedSlot: null,
  reservations: [],
  blocks: [],
  adminEnabled: false,
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
  adminExitButton: document.querySelector("#admin-exit-button"),
  adminRefreshButton: document.querySelector("#admin-refresh-button"),
  adminPanel: document.querySelector("#admin-panel"),
  adminReservations: document.querySelector("#admin-reservations"),
  blockForm: document.querySelector("#block-form"),
};

boot();

function boot() {
  registerServiceWorker();
  elements.dateInput.value = state.selectedDate;
  populateSelects();
  attachEvents();
  updateBanner("Carregando agenda...");
  loadAgenda();
}

function attachEvents() {
  elements.dateInput.addEventListener("change", async (event) => {
    state.selectedDate = event.target.value;
    await loadAgenda();
  });

  elements.refreshButton.addEventListener("click", loadAgenda);
  elements.closePreBookingButton.addEventListener("click", closePreBookingModal);
  elements.cancelPreBookingButton.addEventListener("click", closePreBookingModal);
  elements.continueBookingButton.addEventListener("click", continueToBookingForm);
  elements.closeModalButton.addEventListener("click", closeModal);
  elements.cancelBookingButton.addEventListener("click", closeModal);
  elements.bookingNextButton.addEventListener("click", showPaymentStep);
  elements.bookingForm.querySelector('[name="cpf"]').addEventListener("input", formatCpfInput);
  elements.bookingForm.querySelectorAll('[name="payment"]').forEach((input) => {
    input.addEventListener("change", updatePaymentView);
  });

  elements.bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (elements.bookingSubmitButton.classList.contains("hidden")) {
      showPaymentStep();
      return;
    }

    await submitBooking();
  });

  elements.adminAccessButton.addEventListener("click", toggleAdminAccess);
  elements.adminExitButton.addEventListener("click", disableAdmin);
  elements.adminRefreshButton.addEventListener("click", refreshAdminReservations);

  elements.blockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitBlock(event.currentTarget);
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
  })).filter((row) => row.data && row.quadra && row.horario);
}

function renderSchedule() {
  elements.scheduleGrid.innerHTML = "";

  for (const court of COURTS) {
    const column = document.createElement("article");
    column.className = "schedule-column";

    const header = document.createElement("div");
    header.className = "schedule-column-header";
    header.innerHTML = `<h3>${court.id}</h3><p>${court.name}</p>`;

    const list = document.createElement("div");
    list.className = "slot-list";

    HOURS.forEach((time) => {
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
      status: "blocked",
      description: block.motivo || "Bloqueado",
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
    billed: "Faturado",
  };
  return labels[status];
}

function openPreBookingModal(court, time) {
  state.selectedSlot = { courtId: court.id, courtName: court.name, time };
  elements.preBookingTitle.textContent = `${court.name} • ${formatDate(state.selectedDate)} • ${time}`;
  elements.preBookingAmount.textContent = APP_CONFIG.pricingByCourt[court.id] ?? "Consulte";
  elements.preBookingModal.showModal();
}

function closePreBookingModal() {
  state.selectedSlot = null;
  elements.preBookingModal.close();
}

function continueToBookingForm() {
  if (!state.selectedSlot) {
    return;
  }

  elements.preBookingModal.close();
  elements.bookingSlotTitle.textContent =
    `${state.selectedSlot.courtName} • ${formatDate(state.selectedDate)} • ${state.selectedSlot.time}`;
  elements.bookingForm.reset();
  showRegistrationStep();
  elements.pixKey.textContent = APP_CONFIG.pixKey;
  elements.pixAmount.textContent = APP_CONFIG.pricingByCourt[state.selectedSlot.courtId] ?? "Consulte";
  updatePaymentView();
  elements.bookingModal.showModal();
}

function closeModal() {
  state.selectedSlot = null;
  elements.bookingModal.close();
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
  elements.adminPanel.classList.remove("hidden");
  elements.adminPanel.setAttribute("aria-hidden", "false");
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
  elements.adminPanel.classList.add("hidden");
  elements.adminPanel.setAttribute("aria-hidden", "true");
}

function renderAdminReservations() {
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

async function submitBlock(form) {
  const formData = new FormData(form);
  const block = {
    data: state.selectedDate,
    quadra: String(formData.get("court")),
    horario: String(formData.get("time")),
    motivo: String(formData.get("reason")).trim(),
  };
  const operationKey = `block:create:${block.data}:${block.quadra}:${block.horario}`;

  const reservation = findReservationForSlot(block.quadra, block.horario);
  if (reservation) {
    const statusLabel =
      reservation.status === "confirmado"
        ? "confirmada"
        : reservation.status === "faturado"
          ? "faturada"
          : "pendente";
    updateBanner(
      `Nao foi possivel bloquear ${block.quadra} às ${block.horario}: ja existe uma reserva ${statusLabel}.`,
      true
    );
    return;
  }

  if (!startPendingOperation(operationKey)) {
    updateBanner("Bloqueio já está sendo registrado. Aguarde.", true);
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
    updateBanner(`Bloqueio registrado para ${block.quadra} às ${block.horario}.`);
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
  const courtSelect = elements.blockForm.querySelector('select[name="court"]');
  const timeSelect = elements.blockForm.querySelector('select[name="time"]');

  courtSelect.innerHTML = COURTS.map(
    (court) => `<option value="${court.id}">${court.id} • ${court.name}</option>`
  ).join("");

  timeSelect.innerHTML = HOURS.map((time) => `<option value="${time}">${time}</option>`).join("");
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

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
