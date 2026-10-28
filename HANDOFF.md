# Handoff — Iteration am Smart-Home-Deck

Stand: 2026-10-28 · 168 Folien · Cache-Version 73

## Projekt

- Git-Repo (Branch `master`), aktuell unter Windows ausgecheckt. `git` liegt dort nicht
  im PATH der PowerShell.
- `index.html` ist die **einzige** Quelle der Folien (168 `<section class="slide">`).
  `build/part-*.html` sind historische Zwischenstände und werden **nicht** gepflegt.
- `css/core.css` (Layout + alle Komponenten), `js/engine.js` (Navigation, Fragmente,
  Skalierung), `js/tools.js`, `js/hysterese.js`, `js/ifttt.js` (zwei animierte Schaubilder),
  `js/smarthome.js` (bedienbare Vollbild-Smart-Home-OS-Demo nach den Home-Assistant-Folien, `.shos`, Folienklasse `slide--os`: Haus mit simuliertem Wetter, Tageszeit und Beleuchtung, Dashboard mit Routinen, Wohnzimmer).
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
angleichen: `core.css?v=`, `hysterese.js?v=`, `ifttt.js?v=`, `smarthome.js?v=`. Sonst zieht der Browser alte Dateien.

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
2. ~~Veraltete Folienverweise~~ **Erledigt (2026-10-28):** sichtbarer Text und Notizen verweisen
   jetzt auf Folientitel statt Nummern. Offen: Sichtprüfung der längeren Überschriften auf den
   „Offene Belege"-Folien (Umbruch), und die Zuordnung der Bildquellen auf der Quellen-Folie
   („Folien zu den Anbietern und zu Home Assistant") gegenprüfen. Die HTML-Kommentare
   `<!-- Folie 25 -->` usw. vor den Folien tragen noch die alte Nummerierung (nur im Quelltext).
3. ~~Folie „Abschluss Teil 3"~~ **Erledigt (2026-10-28):** gestrichen, weil sie die Matrix der
   Folie „Vergleichsmatrix: Tuya, Zigbee, Matter" mit veralteten Werten wiederholte
   („sehr günstig" statt „günstig"). Hinweis darauf steht in den Notizen der Merksatz-Folie.
4. **China-Folien (41/42), Quellen vor dem Vortrag gegenprüfen.** Belegt mit Quellen auf den
   Folien und in den Notizen: DPC-Entscheidung gegen TikTok (02.05.2025, 485 Mio. € nach
   Art. 46 Abs. 1 DSGVO; von TikTok angefochten), Liste der Angemessenheitsbeschlüsse der
   EU-Kommission (China nicht enthalten), Nachrichtendienstgesetz Art. 7 (Übersetzung China Law
   Translate; Reichweite umstritten). Nicht im Volltext geprüft: DSGVO Art. 44–46, EuGH
   C‑311/18, SCC-Klausel 14. „Allermeisten Fällen unzulässig“ und „deutsche Aufsichtsbehörden
   fast immer negativ“ wurden gestrichen (nicht belegt). Die Belegfolien am Ende führen die
   Punkte 2–5 noch unter der Quellen-Nummerierung („Folie 57“).
5. **Titelporträt** `images/nils.jpg` ist nur 96x96 px und wird auf 150 px hochskaliert —
   auf dem Beamer sichtbar weich. Höher aufgelöste Datei ersetzen.
6. **Ungenutzte Bilddateien** in `images/`: `img-012-005`, `img-024-011`, `img-026-013`,
   `img-030-015`, `img-032-016`, `img-038-017`, `img-051-030`, `img-090-059`,
   `pages/page-16.png`, `img-017-006`, `img-019-007`, `img-020-008`. Die ersten beiden
   Architektur-PNGs wurden durch natives SVG ersetzt; `page-16.png` gehörte zur gelöschten
   Bildfolie „Beispiel für den Ablauf"; `img-017-006`/`-019-007`/`-020-008` waren die Code-Screenshots, jetzt
   als Text (`pre.codeblock`); der Rest war schon im Original nie eingebunden. Löschen oder behalten ist offen.
7. **Vereinfachung** auf Folie 28, Zeile „Lokaler Betrieb": Tuya ist dort pauschal „nein".
   Über ein Zigbee-Gateway laufen manche Automatisierungen lokal, mit Home Assistant
   ohnehin. Vertretbar, aber angreifbar.
8. **Gelöschte Energie-Folien** (früher 155–158: Datengrundlage, ehrlicher Vorschlag,
   Aufhänger prüfen, Aufhänger Trägt die Zahl?). Die Belegfolie „10a · Takten“ und die Folie
   „Spart das wirklich Energie?“ am Ende verweisen noch darauf; Folie 153 sagt in den Notizen
   „die nächsten Folien zeigen … welche Daten schon vorliegen“. Anpassen oder streichen.
9. **Gelöschte Folie „Was in diesem Vortrag offen bleibt“** (früher Gesamt-Fazit nach den
   vier Fazit-Folien). Die Notizen der Folie „Die Risiken sind nicht nur Datenschutz“ enden
   noch mit „Weiter mit dem, was in diesem Vortrag offen bleibt“.

## Stil

Folien und Chat auf Deutsch. Knappe, präzise Antworten. Nils gibt fortlaufend Feedback,
oft mehrere Punkte in einer Nachricht und auch mitten in laufender Arbeit — direkt umsetzen,
nicht rückfragen, wo die Absicht klar ist.
