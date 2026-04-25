const APP_CONFIG = {
  googleSheetsApiKey: "",
  spreadsheetId: "1yAY3OEWCv0Be3c7YxhTl70rTNBWqJAUXknpU5-UkNXc",
  appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbwY20dNukwG6anIDRf8j41vPk95KLrC7TTshMjrfJ1z3k1F3aWnaslX7AfTOjzvSTga/exec",
  adminPassword: "admin123",
  pixKey: "pix@quadras.com",
  pricingByCourt: {
    BT1: "R$ 80,00",
    BT2: "R$ 80,00",
    TN1: "R$ 100,00",
    TN2: "R$ 100,00",
  },
};

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
};

const elements = {
  dateInput: document.querySelector("#date-input"),
  statusBanner: document.querySelector("#status-banner"),
  scheduleGrid: document.querySelector("#schedule-grid"),
  refreshButton: document.querySelector("#refresh-button"),
  bookingModal: document.querySelector("#booking-modal"),
  bookingForm: document.querySelector("#booking-form"),
  bookingSlotTitle: document.querySelector("#booking-slot-title"),
  pixKey: document.querySelector("#pix-key"),
  pixAmount: document.querySelector("#pix-amount"),
  closeModalButton: document.querySelector("#close-modal-button"),
  cancelBookingButton: document.querySelector("#cancel-booking-button"),
  adminAccessButton: document.querySelector("#admin-access-button"),
  adminExitButton: document.querySelector("#admin-exit-button"),
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
  elements.closeModalButton.addEventListener("click", closeModal);
  elements.cancelBookingButton.addEventListener("click", closeModal);

  elements.bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitBooking();
  });

  elements.adminAccessButton.addEventListener("click", toggleAdminAccess);
  elements.adminExitButton.addEventListener("click", disableAdmin);

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

    const usingFallback = !APP_CONFIG.googleSheetsApiKey || !APP_CONFIG.spreadsheetId;
    updateBanner(
      usingFallback
        ? "Modo local ativo. Configure Google Sheets e Apps Script em `app.js` para produção."
        : `Agenda carregada para ${formatDate(state.selectedDate)}.`
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
  if (!APP_CONFIG.googleSheetsApiKey || !APP_CONFIG.spreadsheetId) {
    return readLocalData()[sheetName === "reservas" ? "reservations" : "blocks"];
  }

  const range = encodeURIComponent(sheetName === "reservas" ? `${sheetName}!A2:F` : `${sheetName}!A2:D`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${APP_CONFIG.spreadsheetId}/values/${range}` +
    `?key=${APP_CONFIG.googleSheetsApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao ler aba ${sheetName}`);
  }

  const payload = await response.json();
  const rows = payload.values ?? [];
  if (sheetName === "reservas") {
    return rows.map(([data, quadra, horario, nome, telefone, status]) => ({
      data,
      quadra,
      horario,
      nome,
      telefone,
      status: status || "pendente",
    }));
  }

  return rows.map(([data, quadra, horario, motivo]) => ({
    data,
    quadra,
    horario,
    motivo,
  }));
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
        card.addEventListener("click", () => openBookingModal(court, time));
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
      description: block.motivo || "Horário indisponível",
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
      description: `Reservado para ${reservation.nome}`,
    };
  }

  return {
    status: "pending",
    description: `Aguardando confirmação de ${reservation.nome}`,
  };
}

function labelForStatus(status) {
  const labels = {
    available: "Disponível",
    pending: "Pendente",
    confirmed: "Confirmado",
    blocked: "Bloqueado",
  };
  return labels[status];
}

function openBookingModal(court, time) {
  state.selectedSlot = { courtId: court.id, courtName: court.name, time };
  elements.bookingSlotTitle.textContent = `${court.id} • ${formatDate(state.selectedDate)} • ${time}`;
  elements.pixKey.textContent = APP_CONFIG.pixKey;
  elements.pixAmount.textContent = APP_CONFIG.pricingByCourt[court.id] ?? "Consulte";
  elements.bookingForm.reset();
  elements.bookingModal.showModal();
}

function closeModal() {
  state.selectedSlot = null;
  elements.bookingModal.close();
}

async function submitBooking() {
  if (!state.selectedSlot) {
    return;
  }

  const formData = new FormData(elements.bookingForm);
  const booking = {
    data: state.selectedDate,
    quadra: state.selectedSlot.courtId,
    horario: state.selectedSlot.time,
    nome: String(formData.get("name") || "").trim(),
    telefone: String(formData.get("phone") || "").trim(),
    status: "pendente",
  };

  if (!booking.nome || !booking.telefone) {
    updateBanner("Preencha nome e telefone antes de enviar a reserva.", true);
    return;
  }

  await submitMutation("reservation:create", booking, ({ reservations, blocks }) => ({
    reservations: [...reservations, booking],
    blocks,
  }));

  closeModal();
  await loadAgenda();
  updateBanner(
    `Reserva enviada para ${booking.quadra} às ${booking.horario}. Status pendente até confirmação do PIX.`
  );
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
  renderAdminReservations();
  updateBanner("Painel admin liberado para a data selecionada.");
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

  const dayItems = [...state.reservations]
    .sort((a, b) => a.horario.localeCompare(b.horario) || a.quadra.localeCompare(b.quadra));

  if (!dayItems.length) {
    elements.adminReservations.innerHTML =
      "<p class='fine-print'>Nenhuma reserva registrada para esta data.</p>";
    return;
  }

  elements.adminReservations.innerHTML = "";
  dayItems.forEach((reservation) => {
    const item = document.createElement("article");
    item.className = "admin-item";
    item.innerHTML = `
      <div class="admin-item-top">
        <strong>${reservation.quadra} • ${reservation.horario}</strong>
        <span>${labelForStatus(
          reservation.status === "confirmado" ? "confirmed" : "pending"
        )}</span>
      </div>
      <p class="admin-item-meta">${reservation.nome} • ${reservation.telefone}</p>
    `;

    if (reservation.status !== "confirmado") {
      const actions = document.createElement("div");
      actions.className = "admin-item-actions";

      const confirmButton = document.createElement("button");
      confirmButton.className = "mini-button";
      confirmButton.type = "button";
      confirmButton.textContent = "Confirmar PIX";
      confirmButton.addEventListener("click", async () => {
        await confirmReservation(reservation);
      });

      actions.appendChild(confirmButton);
      item.appendChild(actions);
    }

    elements.adminReservations.appendChild(item);
  });
}

async function confirmReservation(reservation) {
  const updatedReservation = { ...reservation, status: "confirmado" };
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
}

async function submitBlock(form) {
  const formData = new FormData(form);
  const block = {
    data: state.selectedDate,
    quadra: String(formData.get("court")),
    horario: String(formData.get("time")),
    motivo: String(formData.get("reason")).trim(),
  };

  const reservation = findReservationForSlot(block.quadra, block.horario);
  if (reservation) {
    const statusLabel = reservation.status === "confirmado" ? "confirmada" : "pendente";
    updateBanner(
      `Nao foi possivel bloquear ${block.quadra} às ${block.horario}: ja existe uma reserva ${statusLabel}.`,
      true
    );
    return;
  }

  await submitMutation("block:create", block, ({ reservations, blocks }) => ({
    reservations,
    blocks: [...blocks, block],
  }));

  form.reset();
  await loadAgenda();
  updateBanner(`Bloqueio registrado para ${block.quadra} às ${block.horario}.`);
}

async function submitMutation(action, payload, fallbackUpdater) {
  if (APP_CONFIG.appsScriptWebhookUrl) {
    const response = await fetch(APP_CONFIG.appsScriptWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar webhook do Apps Script");
    }

    return;
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
