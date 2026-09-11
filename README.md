# Gesprächslotse

Webapp, die Telefonate (z. B. über Webex oder Mobilfunk, per Lautsprecher oder Headset) live mitschreibt und per Knopfdruck zu einem strukturierten Gesprächsprotokoll zusammenfasst.

## Funktionsweise

- **Start/Stop** nimmt über das Mikrofon des Geräts auf und transkribiert live im Browser (Web Speech API, `de-DE`).
- Nach **Stop** schickt das Frontend die Mitschrift an `/api/summarize`, eine serverseitige Funktion, die über die offizielle Anthropic-SDK ein strukturiertes Protokoll erzeugt: Kernthemen, Vereinbarungen, offene Punkte, Stimmung, Kurzzusammenfassung (als validiertes JSON via `output_config.format`).
- Fallback: Transkript lässt sich auch manuell einfügen, falls Mikrofon/Browser nicht mitspielen.
- Der Anthropic-API-Key liegt ausschließlich serverseitig (Umgebungsvariable), nie im Frontend-Code.

## Deployment (Vercel empfohlen)

1. Repo in [vercel.com/new](https://vercel.com/new) importieren (Node-Projekt, Framework-Preset "Other" — `api/` wird automatisch als Serverless Function erkannt).
2. Umgebungsvariable `ANTHROPIC_API_KEY` in den Projekteinstellungen setzen (Wert aus [console.anthropic.com](https://console.anthropic.com)).
3. Deploy — danach läuft sowohl die statische Seite als auch `/api/summarize` unter derselben Domain.

## Lokale Entwicklung

```bash
npm install
npm i -g vercel   # falls noch nicht vorhanden
vercel dev
```

`vercel dev` startet Frontend und `/api`-Funktion zusammen (braucht `ANTHROPIC_API_KEY` in einer lokalen `.env`, siehe `.env.example`).

**Hinweis:** Reines Hosting über GitHub Pages reicht nicht mehr aus — GitHub Pages kann nur statische Dateien ausliefern, keine Serverless Function. Für die echte KI-Zusammenfassung ist eine Plattform mit Funktions-Unterstützung nötig (Vercel, Netlify, Cloudflare Pages o. ä.).

## Status

Proof-of-Concept für einen Pitch. Bewusst getrennt von jeglicher CRM-Anbindung — die spätere Integration (z. B. Verknüpfung mit Kontakten/Deals) ist ein möglicher nächster Schritt, kein Teil dieser Demo.
