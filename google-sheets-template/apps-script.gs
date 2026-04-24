function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var action = body.action;
    var payload = body.payload || {};
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "reservation:create") {
      appendReservation_(spreadsheet, payload);
      return jsonResponse_({ ok: true });
    }

    if (action === "reservation:confirm") {
      confirmReservation_(spreadsheet, payload);
      return jsonResponse_({ ok: true });
    }

    if (action === "block:create") {
      appendBlock_(spreadsheet, payload);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: "Acao invalida" });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function appendReservation_(spreadsheet, payload) {
  var sheet = spreadsheet.getSheetByName("reservas");
  ensureSheet_(sheet, "reservas");

  sheet.appendRow([
    payload.data || "",
    payload.quadra || "",
    payload.horario || "",
    payload.nome || "",
    payload.telefone || "",
    payload.status || "pendente",
  ]);
}

function confirmReservation_(spreadsheet, payload) {
  var sheet = spreadsheet.getSheetByName("reservas");
  ensureSheet_(sheet, "reservas");

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    throw new Error("Nenhuma reserva encontrada para confirmar.");
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  for (var i = values.length - 1; i >= 0; i -= 1) {
    var row = values[i];
    var sameReservation =
      row[0] === (payload.data || "") &&
      row[1] === (payload.quadra || "") &&
      row[2] === (payload.horario || "") &&
      row[4] === (payload.telefone || "");

    if (sameReservation) {
      sheet.getRange(i + 2, 6).setValue("confirmado");
      return;
    }
  }

  throw new Error("Reserva nao encontrada para confirmacao.");
}

function appendBlock_(spreadsheet, payload) {
  var sheet = spreadsheet.getSheetByName("bloqueios");
  ensureSheet_(sheet, "bloqueios");

  sheet.appendRow([
    payload.data || "",
    payload.quadra || "",
    payload.horario || "",
    payload.motivo || "",
  ]);
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
