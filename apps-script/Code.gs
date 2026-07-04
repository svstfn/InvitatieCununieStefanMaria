/*
 * CONFIGURARE (Apps Script LEGAT de Sheet — Extensii → Apps Script din Sheet)
 *
 * 1. Deschide Google Sheet-ul unde vrei raspunsurile.
 * 2. Copiaza ID-ul din URL: .../spreadsheets/d/ACEST_ID/edit
 * 3. Lipeste ID-ul mai jos la SPREADSHEET_ID.
 * 4. Extensii → Apps Script → lipeste tot fisierul → Salveaza.
 * 5. Implementeaza → Implementare noua → Web app → Executare: Eu → Acces: Oricine.
 * 6. La update: Gestionare implementari → Editeaza → Versiune noua → Deploy.
 * 7. URL-ul in CONFIG.scriptUrl din assets/script.js.
 */
const SPREADSHEET_ID = ''; // ex: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
const SHEET_NAME = 'Raspunsuri';

function doPost(e) {
  try {
    return saveRsvp_(getParams_(e));
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.nume) {
    try {
      return saveRsvp_(e.parameter);
    } catch (err) {
      return json_({ result: 'error', error: String(err) });
    }
  }
  return ContentService.createTextOutput('RSVP endpoint activ.');
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Seteaza SPREADSHEET_ID in Code.gs (ID din URL-ul Sheet-ului).');
  }
  return ss;
}

function getParams_(e) {
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
  if (e && e.postData && e.postData.contents) {
    return parseFormBody_(e.postData.contents);
  }
  return {};
}

function parseFormBody_(body) {
  const params = {};
  body.split('&').forEach(function (pair) {
    if (!pair) return;
    const idx = pair.indexOf('=');
    const key = decodeURIComponent((idx === -1 ? pair : pair.slice(0, idx)).replace(/\+/g, ' '));
    const val = decodeURIComponent((idx === -1 ? '' : pair.slice(idx + 1)).replace(/\+/g, ' '));
    params[key] = val;
  });
  return params;
}

function saveRsvp_(params) {
  if (params.website) {
    return json_({ result: 'ignored' });
  }

  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Nume', 'Prezenta', 'Persoane', 'Meniu', 'Mesaj']);
  }

  sheet.appendRow([
    new Date(),
    params.nume || '',
    params.prezenta || '',
    params.persoane || '',
    '',
    params.mesaj || ''
  ]);

  return json_({ result: 'success', sheet: SHEET_NAME });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
