# Invitație cununie — Maria & Stefan

Site static pentru invitația la cununia civilă (31.07.2026). Formular RSVP → Google Sheet (Apps Script).

## Link public (GitHub Pages)

După deploy:

**https://svstfn.github.io/InvitatieCununieStefanMaria/**

## Deploy pe GitHub Pages

1. Repo: `svstfn/InvitatieCununieStefanMaria` (branch `main`, folder `/` root).
2. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
3. Așteaptă 1–2 minute; reîmprospătează linkul de mai sus.

Fișierul `.nojekyll` din root evită probleme Jekyll cu folderele `imagini/` și `assets/`.

## Local

```bash
cd InvitatiiCununie
python3 -m http.server 8000
# http://localhost:8000
```

## RSVP (Google Apps Script)

1. Copiază `apps-script/Code.gs` într-un proiect Apps Script legat de Sheet.
2. Setează `SPREADSHEET_ID`, deploy **Web app** (Executare: Eu, Acces: Oricine).
3. URL-ul Web App este deja în `assets/script.js` → `CONFIG.scriptUrl`.

## Structură

| Path | Rol |
|------|-----|
| `index.html` | Invitația |
| `assets/styles.css`, `assets/script.js` | Design + logică |
| `imagini/` | Poze miri și locații |
| `apps-script/Code.gs` | Backend Sheet (deploy manual) |
