# Handoff — Iteration am Smart-Home-Deck

Stand: 2026-10-27 · 173 Folien · Cache-Version 59

## Projekt

- Git-Repo (Branch `master`), aktuell unter Windows ausgecheckt. `git` liegt dort nicht
  im PATH der PowerShell.
- `index.html` ist die **einzige** Quelle der Folien (173 `<section class="slide">`).
  `build/part-*.html` sind historische Zwischenstände und werden **nicht** gepflegt.
- `css/core.css` (Layout + alle Komponenten), `js/engine.js` (Navigation, Fragmente,
  Skalierung), `js/tools.js`, `js/hysterese.js`, `js/ifttt.js` (zwei animierte Schaubilder).
- Folien werden in 1920x1080 gesetzt und skaliert. Inhalt muss in 1080 px Höhe passen —
  Überlauf ist der häufigste Fehler.

## Server und Verifikation

Server im Projektordner mit `python serve.py` starten (Port 8777, Live-Reload: Browser
lädt bei jeder gespeicherten Änderung neu, Folie bleibt). Falls die Sandbox
keine Ports binden darf, über ein Preview-Tool starten (eine `.claude/launch.json` ist
im aktuellen Checkout nicht vorhanden und müsste neu angelegt werden).
Danach `http://localhost:8777/index.html?r=<version>#/<folie>` ansteuern.
Der Server stirbt gelegentlich — bei leerem Screenshot zuerst `curl` prüfen und neu starten.

**Jede** Änderung wird im Browser per Screenshot verifiziert, bevor sie als fertig gilt.
Fragmente einzeln mit `Right` aufdecken; `repeat` in einem Rutsch wird nicht immer
zuverlässig verarbeitet, lieber einzelne Tastendrücke.

## Pflicht nach CSS/JS-Änderungen

`DECK_VERSION` in `js/engine.js` hochzählen **und** in `index.html` alle drei Query-Parameter
angleichen: `core.css?v=`, `hysterese.js?v=`, `ifttt.js?v=`. Sonst zieht der Browser alte Dateien.

## Arbeitsweise, die sich bewährt hat

- Folien **nach Inhalt** finden, nie nach Nummer. Nils' Nummern liegen durch die vielen
  Zusammenführungen oft 1–3 daneben. Bei Unklarheit die Überschrift zitieren und nachfragen.
- Bearbeitung über kurze Python-Skripte mit `sys.exit` bei nicht gefundenem oder nicht
  eindeutigem Anker — verhindert stille Fehlbearbeitung.
- Gestrichener Fließtext wandert **vollständig** in die `.notes` der Zielfolie. Nichts verlieren.
- Bilder nur aus frei lizenzierten Quellen (Unsplash, Wikimedia Commons), Nachweis auf der
  Folie. Keine Hersteller- oder Pressegrafiken. Schaubilder lieber selbst als Inline-SVG
  zeichnen — passt zum Theme, skaliert verlustfrei, keine Lizenzfrage.
- Externe Fakten vor dem Einbau mit Websuche verifizieren und die Quelle in den Notizen nennen.

## Wichtige Eigenheit der Engine

`data-fragment="n"` bedeutet **n-ter Klick**, nicht n-tes Element. Mehrere Elemente mit
derselben Nummer erscheinen gemeinsam. Das war ursprünglich ein Bug in `fragmentsOf()`
und wurde in `js/engine.js` korrigiert (`fragmentSteps`, `fragmentCount`).

## CSS-Vokabular (selbst gebaut, in core.css)

`.slide--hero` `.slide--split` `.slide--media--wide` `.slide--bg` `.slide--photo` (+`.band`,
`.tile`, `.credit`) · `.agenda` `.layers` `.layers--stack` `.icon-list` `.num-list`
`.reasons` · `.matrix` (+`.m-cell`, `.m-rate--good/mid/bad`, `.m-pie`) · `.ctable`
`.flow` `.archfig` `.portfig` `.duo` `.roadmap` `.spectrum` `.converge` · `.clipping`
(Zeitungsausschnitt) · `.slide-badge` `.postit` (Arbeitsmarkierungen) ·
Ampelfarben als `--ok` / `--mid` / `--bad` auf `:root`.

**Wichtig:** `.slide` ist `position:absolute; inset:0`. Eine Folienklasse darf das **nicht**
mit `position:relative` überschreiben — die Folie kollabiert dann auf Inhaltshöhe.
Ebenso ist `.slide` ein Column-Flexbox; Varianten mit seitlichem Layout brauchen
explizit `flex-direction: row`.
Themes stylen `.slide li` und `.slide p` — eigene Komponenten brauchen oft
`.slide`-Präfix in der Selektorkette, sonst gewinnt das Theme.

## Offene Punkte

1. **Bedienebene dreifach.** Folie 13 (Original), 14 (Layout-Vorschlag A, Spektrum),
   15 (Layout-Vorschlag B, Konvergenz). Nils muss eine wählen; die anderen beiden samt
   Badges löschen. Empfehlung war B.
2. **Veraltete Folienverweise** im sichtbaren Text auf 15 Folien: 58, 127–131, 138, 140,
   142, 166–170, 173. Alle stammen aus der Nummerierung des Ursprungsdokuments und zeigen
   nach den Umbauten ins Leere. Empfehlung: durch inhaltliche Formulierungen ersetzen
   („wie eben bei den Kommunikationswegen") statt umzurechnen — sonst bricht es beim
   nächsten Umbau erneut.
3. **Folie 38 „Abschluss Teil 3"** wiederholt die Matrix von Folie 29 eins zu eins, mit
   veralteten Werten („sehr günstig" statt „günstig"). Angleichen oder streichen.
4. **Unbelegte Rechtsaussagen** auf den China-Folien (ca. 42/43): Angemessenheitsbeschluss,
   Art. 7 chin. Geheimdienstgesetz, TIA-Ergebnis. Steht als offen auf den Belegfolien
   am Ende. Vor einem öffentlichen Vortrag belegen oder abschwächen.
5. **Titelporträt** `images/nils.jpg` ist nur 96x96 px und wird auf 150 px hochskaliert —
   auf dem Beamer sichtbar weich. Höher aufgelöste Datei ersetzen.
6. **Ungenutzte Bilddateien** in `images/`: `img-012-005`, `img-024-011`, `img-026-013`,
   `img-030-015`, `img-032-016`, `img-038-017`, `img-051-030`, `img-090-059`.
   Die ersten beiden Architektur-PNGs wurden durch natives SVG ersetzt; der Rest war schon
   im Original nie eingebunden. Löschen oder behalten ist offen.
7. **Vereinfachung** auf Folie 29, Zeile „Lokaler Betrieb": Tuya ist dort pauschal „nein".
   Über ein Zigbee-Gateway laufen manche Automatisierungen lokal, mit Home Assistant
   ohnehin. Vertretbar, aber angreifbar.

## Stil

Folien und Chat auf Deutsch. Knappe, präzise Antworten. Nils gibt fortlaufend Feedback,
oft mehrere Punkte in einer Nachricht und auch mitten in laufender Arbeit — direkt umsetzen,
nicht rückfragen, wo die Absicht klar ist.
