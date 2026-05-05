function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lock.waitLock(10000);
    lockAcquired = true;

    var body = JSON.parse(e.postData.contents || "{}");
    var action = body.action;
    var payload = body.payload || {};
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "reservation:create") {
      return jsonResponse_(appendReservation_(spreadsheet, payload));
    }

    if (action === "reservation:confirm") {
      return jsonResponse_(confirmReservation_(spreadsheet, payload));
    }

    if (action === "block:create") {
      return jsonResponse_(appendBlock_(spreadsheet, payload));
    }

    if (action === "config:update") {
      return jsonResponse_(updateConfig_(spreadsheet, payload));
    }

    return jsonResponse_({ ok: false, error: "Acao invalida" });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

function appendReservation_(spreadsheet, payload) {
  validateRequired_(payload, ["data", "quadra", "horario", "nome", "telefone", "cpf"]);
  validateNotPastDate_(payload.data);

  var reservationsSheet = spreadsheet.getSheetByName("reservas");
  var blocksSheet = spreadsheet.getSheetByName("bloqueios");
  ensureSheet_(reservationsSheet, "reservas");
  ensureSheet_(blocksSheet, "bloqueios");

  var existingReservation = findReservationRow_(reservationsSheet, payload);
  if (existingReservation) {
    var existing = existingReservation.values;
    var sameCustomer =
      String(existing[4] || "").trim() === String(payload.telefone || "").trim() ||
      String(existing[5] || "").trim() === String(payload.cpf || "").trim();

    if (!sameCustomer) {
      throw new Error("Horario ja reservado. Reserva nao criada.");
    }

    return {
      ok: true,
      duplicate: true,
      row: existingReservation.rowNumber,
      message: "Reserva ja existente para este horario.",
    };
  }

  var existingBlock = findBlockRow_(blocksSheet, payload);
  if (existingBlock) {
    throw new Error("Horario bloqueado. Reserva nao criada.");
  }

  reservationsSheet.appendRow([
    payload.data || "",
    payload.quadra || "",
    payload.horario || "",
    payload.nome || "",
    payload.telefone || "",
    payload.cpf || "",
    payload.status || "pendente",
    payload.pagamento || "pix",
    payload.observacao || "",
    payload.price || "",
    payload.period || "",
    JSON.stringify(payload.pricingSnapshot || {}),
  ]);

  return { ok: true, created: true };
}

function confirmReservation_(spreadsheet, payload) {
  validateRequired_(payload, ["data", "quadra", "horario", "telefone"]);

  var sheet = spreadsheet.getSheetByName("reservas");
  ensureSheet_(sheet, "reservas");

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    throw new Error("Nenhuma reserva encontrada para confirmar.");
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  for (var i = values.length - 1; i >= 0; i -= 1) {
    var row = values[i];
    var sameReservation =
      normalizeDate_(row[0]) === normalizeDate_(payload.data || "") &&
      String(row[1] || "").trim() === String(payload.quadra || "").trim() &&
      normalizeTime_(row[2]) === normalizeTime_(payload.horario || "") &&
      String(row[4] || "").trim() === String(payload.telefone || "").trim();

    if (sameReservation) {
      if (row[6] === "confirmado") {
        return { ok: true, alreadyConfirmed: true };
      }

      sheet.getRange(i + 2, 7).setValue("confirmado");
      return { ok: true, confirmed: true };
    }
  }

  throw new Error("Reserva nao encontrada para confirmacao.");
}

function appendBlock_(spreadsheet, payload) {
  validateRequired_(payload, ["data", "quadra", "horario"]);

  var reservationsSheet = spreadsheet.getSheetByName("reservas");
  var blocksSheet = spreadsheet.getSheetByName("bloqueios");
  ensureSheet_(reservationsSheet, "reservas");
  ensureSheet_(blocksSheet, "bloqueios");

  var existingReservation = findReservationRow_(reservationsSheet, payload);
  if (existingReservation) {
    throw new Error("Ja existe reserva para este horario. Bloqueio nao criado.");
  }

  var existingBlock = findBlockRow_(blocksSheet, payload);
  if (existingBlock) {
    return {
      ok: true,
      duplicate: true,
      row: existingBlock.rowNumber,
      message: "Bloqueio ja existente para este horario.",
    };
  }

  blocksSheet.appendRow([
    payload.data || "",
    payload.quadra || "",
    payload.horario || "",
    payload.motivo || "",
    payload.tipo || "Manutenção",
  ]);

  return { ok: true, created: true };
}

function updateConfig_(spreadsheet, payload) {
  var settings = payload.settings || payload || {};
  var sheet = spreadsheet.getSheetByName("config");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("config");
  }

  var existingEntries = readKeyValueSheet_(sheet);
  var pricingConfig = settings.pricingConfig || {};
  var merged = {
    pixKey: String(settings.pixKey || existingEntries.pixKey || "").trim(),
    whatsappPhoneNumber: String(settings.whatsappPhoneNumber || existingEntries.whatsappPhoneNumber || "").trim(),
    openingStart: String(settings.openingStart || existingEntries.openingStart || "07:00").trim(),
    openingEnd: String(settings.openingEnd || existingEntries.openingEnd || "22:00").trim(),
    "pricing.beachTennis.dayPrice": String(
      (pricingConfig.beachTennis && pricingConfig.beachTennis.dayPrice) ||
        settings.dayPrice ||
        existingEntries["pricing.beachTennis.dayPrice"] ||
        existingEntries.dayPrice ||
        ""
    ).trim(),
    "pricing.beachTennis.nightPrice": String(
      (pricingConfig.beachTennis && pricingConfig.beachTennis.nightPrice) ||
        settings.nightPrice ||
        existingEntries["pricing.beachTennis.nightPrice"] ||
        existingEntries.nightPrice ||
        ""
    ).trim(),
    "pricing.tennis.dayPrice": String(
      (pricingConfig.tennis && pricingConfig.tennis.dayPrice) ||
        settings.tennisDayPrice ||
        existingEntries["pricing.tennis.dayPrice"] ||
        existingEntries.tennisDayPrice ||
        ""
    ).trim(),
    "pricing.tennis.nightPrice": String(
      (pricingConfig.tennis && pricingConfig.tennis.nightPrice) ||
        settings.tennisNightPrice ||
        existingEntries["pricing.tennis.nightPrice"] ||
        existingEntries.tennisNightPrice ||
        ""
    ).trim(),
    "pricing.nightStartsAt": String(
      pricingConfig.nightStartsAt ||
        settings.nightStartsAt ||
        existingEntries["pricing.nightStartsAt"] ||
        existingEntries.nightStartsAt ||
        "18:00"
    ).trim(),
    "pricing.updatedAt": String(
      pricingConfig.updatedAt || settings.updatedAt || existingEntries["pricing.updatedAt"] || existingEntries.updatedAt || ""
    ).trim(),
    BT1: String((settings.pricingByCourt && settings.pricingByCourt.BT1) || settings.BT1 || existingEntries.BT1 || "").trim(),
    BT2: String((settings.pricingByCourt && settings.pricingByCourt.BT2) || settings.BT2 || existingEntries.BT2 || "").trim(),
    TN1: String((settings.pricingByCourt && settings.pricingByCourt.TN1) || settings.TN1 || existingEntries.TN1 || "").trim(),
    TN2: String((settings.pricingByCourt && settings.pricingByCourt.TN2) || settings.TN2 || existingEntries.TN2 || "").trim(),
  };

  var incomingCopy = settings.copy || {};
  if (incomingCopy && typeof incomingCopy === "object") {
    Object.keys(incomingCopy).forEach(function (key) {
      if (!key) {
        return;
      }
      merged["copy." + key] = String(incomingCopy[key] || "").trim();
    });
  }

  var knownKeys = {
    pixKey: true,
    whatsappPhoneNumber: true,
    openingStart: true,
    openingEnd: true,
    "pricing.beachTennis.dayPrice": true,
    "pricing.beachTennis.nightPrice": true,
    "pricing.tennis.dayPrice": true,
    "pricing.tennis.nightPrice": true,
    "pricing.nightStartsAt": true,
    "pricing.updatedAt": true,
  };

  Object.keys(existingEntries).forEach(function (key) {
    if (!knownKeys[key]) {
      merged[key] = existingEntries[key];
    }
  });

  writeKeyValueSheet_(sheet, merged, [
    "pixKey",
    "whatsappPhoneNumber",
    "openingStart",
    "openingEnd",
    "pricing.beachTennis.dayPrice",
    "pricing.beachTennis.nightPrice",
    "pricing.tennis.dayPrice",
    "pricing.tennis.nightPrice",
    "pricing.nightStartsAt",
    "pricing.updatedAt",
  ]);

  return { ok: true, updated: true };
}

function findReservationRow_(sheet, payload) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  for (var i = values.length - 1; i >= 0; i -= 1) {
    var row = values[i];
    var sameSlot =
      normalizeDate_(row[0]) === normalizeDate_(payload.data || "") &&
      String(row[1] || "").trim() === String(payload.quadra || "").trim() &&
      normalizeTime_(row[2]) === normalizeTime_(payload.horario || "");

    if (sameSlot) {
      return { rowNumber: i + 2, values: row };
    }
  }

  return null;
}

function findBlockRow_(sheet, payload) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  for (var i = values.length - 1; i >= 0; i -= 1) {
    var row = values[i];
    var sameSlot =
      normalizeDate_(row[0]) === normalizeDate_(payload.data || "") &&
      String(row[1] || "").trim() === String(payload.quadra || "").trim() &&
      normalizeTime_(row[2]) === normalizeTime_(payload.horario || "");

    if (sameSlot) {
      return { rowNumber: i + 2, values: row };
    }
  }

  return null;
}

function validateRequired_(payload, fields) {
  fields.forEach(function (field) {
    if (!String(payload[field] || "").trim()) {
      throw new Error("Campo obrigatorio ausente: " + field + ".");
    }
  });
}

function readKeyValueSheet_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  var map = {};
  values.forEach(function (row) {
    var key = String(row[0] || "").trim();
    if (!key) {
      return;
    }
    map[key] = String(row[1] || "").trim();
  });
  return map;
}

function writeKeyValueSheet_(sheet, entries, orderedKeys) {
  var rows = [["chave", "valor"]];
  var written = {};

  orderedKeys.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(entries, key)) {
      rows.push([key, entries[key]]);
      written[key] = true;
    }
  });

  Object.keys(entries).sort().forEach(function (key) {
    if (written[key]) {
      return;
    }
    rows.push([key, entries[key]]);
  });

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
}

function validateNotPastDate_(value) {
  var date = normalizeDate_(value);
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

  if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date < today) {
    throw new Error("Nao e possivel criar reserva em data passada.");
  }
}

function normalizeDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  var text = String(value || "").trim();
  var brDateMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brDateMatch) {
    return (
      brDateMatch[3] +
      "-" +
      brDateMatch[2].padStart(2, "0") +
      "-" +
      brDateMatch[1].padStart(2, "0")
    );
  }

  return text;
}

function normalizeTime_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "HH:mm");
  }

  var text = String(value || "").trim();
  var timeMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeMatch) {
    return timeMatch[1].padStart(2, "0") + ":" + timeMatch[2];
  }

  return text;
}

function ensureSheet_(sheet, name) {
  if (!sheet) {
    throw new Error('Aba obrigatoria ausente: "' + name + '".');
  }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
