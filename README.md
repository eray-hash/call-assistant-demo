# Gesprächslotse

Live-Demo einer Webapp, die Telefonate (z. B. über Webex oder Mobilfunk, per Lautsprecher oder Headset) live mitschreibt und per Knopfdruck zu einem strukturierten Gesprächsprotokoll zusammenfasst.

## Funktionsweise

- **Start/Stop** nimmt über das Mikrofon des Geräts auf und transkribiert live im Browser (Web Speech API, `de-DE`).
- Nach **Stop** erstellt Claude aus der Mitschrift automatisch ein Protokoll: Kernthemen, Vereinbarungen, offene Punkte, Stimmung, Kurzzusammenfassung.
- Fallback: Transkript lässt sich auch manuell einfügen, falls Mikrofon/Browser nicht mitspielen.
- Reine Client-Anwendung, keine eigene Server-Komponente — die KI-Zusammenfassung läuft über die `sample`-Capability der Anzeigeumgebung.

## Nutzung

`index.html` direkt im Browser öffnen (Chrome empfohlen, für die Spracherkennung) oder über GitHub Pages / einen beliebigen statischen Webserver hosten.

## Status

Proof-of-Concept für einen Pitch. Bewusst getrennt von jeglicher CRM-Anbindung — die spätere Integration (z. B. Verknüpfung mit Kontakten/Deals) ist ein möglicher nächster Schritt, kein Teil dieser Demo.
