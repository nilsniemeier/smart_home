# Prompt-Vorlage: Inhalte in das Deck einfügen

Unten den Block ab `--- PROMPT START ---` kopieren, am Ende die Quelle
eintragen und abschicken.

--- PROMPT START ---

Du baust vorgefertigte Inhalte in ein bestehendes HTML-Präsentationssystem ein.
Arbeite ausschließlich im Projektordner (Repo-Wurzel).

## Auftrag

Ersetze die Demo-Folien in `index.html` durch Folien aus der unten genannten
Quelle. Das Framework selbst bleibt unverändert.

## Harte Regeln

1. **Nur `index.html` ändern.** `js/engine.js`, `js/tools.js`, `css/core.css`
   und `css/themes/*.css` nicht anfassen. Brauchst du eine Formatierung, die es
   nicht gibt: nimm die nächstbeste vorhandene Klasse und notiere das am Ende
   in deinem Bericht — kein neues CSS, keine Inline-Styles außer den in der
   Quelle vorgegebenen Zahlenwerten.
2. **Keine Inhalte erfinden.** Jede Überschrift, Zahl, Aussage und Quellenangabe
   kommt aus dem Quellmaterial. Fehlt etwas (z. B. ein Agenda-Punkt ohne Inhalt),
   lege die Folie mit dem vorhandenen Text an und liste die Lücke im Bericht.
   Zahlen exakt übernehmen, inklusive Einheit und Jahr. Nicht runden, nicht
   umrechnen, nicht „glätten“.
3. **Sprache und Ton der Quelle behalten.** Folientexte kürzen ist erlaubt und
   erwünscht (siehe Dichte), umformulieren nur so weit, wie es zum Kürzen nötig
   ist.
4. **Lies das Quellmaterial vollständig, bevor du die erste Folie schreibst.**
   Bei PDFs alle Seiten.

## Struktur, die du erzeugst

Ersetze alles zwischen `<div class="deck">` und dem schließenden `</div>` durch
deine Folien. Jede Folie ist ein `<section class="slide">`.

Verbindlicher Bauplan je Folientyp:

**Titelfolie** (genau eine, erste Folie)
```html
<section class="slide slide--center" data-transition="zoom">
  <p class="kicker">RUBRIK · JAHR</p>
  <h1>Titel</h1>
  <p class="lead">Ein Satz Untertitel.</p>
  <div class="notes">Sprechnotiz.</div>
</section>
```

**Aufzählung / Agenda**
```html
<section class="slide" data-transition="slide" data-fragment-mode="dim-prior">
  <p class="kicker">Rubrik</p>
  <h2>Überschrift</h2>
  <ul>
    <li data-fragment="1">Punkt eins</li>
    <li data-fragment="2">Punkt zwei</li>
  </ul>
  <div class="notes">Sprechnotiz.</div>
</section>
```

**Kennzahlen** (2–4 Werte nebeneinander)
```html
<section class="slide" data-transition="rise">
  <p class="kicker">Rubrik</p>
  <h2>Überschrift</h2>
  <div class="cols cols--3">
    <div data-fragment="1">
      <div class="metric">43 %</div>
      <p>Erläuterung in einer Zeile</p>
    </div>
    <!-- weitere Werte analog, data-fragment fortlaufend -->
  </div>
  <div class="notes">Sprechnotiz.</div>
</section>
```

**Karten / Konzepte** (2–4 gleichrangige Blöcke)
```html
<section class="slide" data-transition="slide">
  <p class="kicker">Rubrik</p>
  <h2>Überschrift</h2>
  <div class="cols cols--3">
    <div class="card" data-fragment="1" data-fragment-style="grow">
      <h3>Begriff</h3>
      <p>Ein bis zwei Sätze.</p>
    </div>
    <!-- weitere Karten analog -->
  </div>
  <div class="notes">Sprechnotiz.</div>
</section>
```

**Zitat / Kernaussage**
```html
<section class="slide slide--center" data-transition="fade">
  <h2 data-fragment="1" data-fragment-style="blur">„Zitat.“</h2>
  <p class="lead" data-fragment="2">— Quelle</p>
</section>
```

**Bild**
```html
<section class="slide" data-transition="fade">
  <p class="kicker">Rubrik</p>
  <h2>Überschrift</h2>
  <figure>
    <img src="images/DATEINAME" alt="Beschreibung des Bildinhalts">
  </figure>
  <div class="notes">Sprechnotiz.</div>
</section>
```

**Zwei Spalten Text** → `<div class="cols">` mit zwei `<div>` darin.
**Abschlussfolie** → wie Titelfolie, `<h1>` z. B. „Fragen?“.

## Erlaubtes Inventar

Nur diese Klassen und Attribute verwenden:

- Folie: `slide`, dazu optional `slide--center`
- `data-transition`: `fade` · `slide` · `zoom` · `rise`
- `data-fragment="1"`, `"2"`, … fortlaufend **ab 1 pro Folie**, lückenlos
- `data-fragment-style`: `grow` · `blur` (sonst weglassen)
- `data-fragment-mode="dim-prior"` auf der `<section>` (nur bei Aufzählungen)
- Text: `kicker`, `lead`, `metric`, `h1`, `h2`, `h3`, `p`, `ul`/`ol`/`li`,
  `strong`, `code`, `figure`, `img`
- Raster: `cols`, `cols--3`, `cols--4`, `card`
- Notizen: `<div class="notes">…</div>`

Alles andere ist nicht vorgesehen.

## Dichte und Umfang

- Pro Folie **ein** Gedanke. Lieber zwei Folien als eine volle.
- `h1` max. 6 Wörter, `h2` max. 9 Wörter.
- Listen: max. 5 Punkte, je max. 12 Wörter, kein Punkt am Ende.
- `.card p`: max. 2 Sätze.
- `.metric`: max. 6 Zeichen (z. B. `43 %`, `18 h`, `7 J.`).
- Fließtext-`<p>`: max. 3 Zeilen à ~60 Zeichen.
- Der Inhalt wird in 1920×1080 gerendert. Was nicht in die Folie passt,
  wird abgeschnitten — im Zweifel kürzen oder splitten.

## Sprechnotizen

Jede inhaltliche Folie bekommt `<div class="notes">` mit 1–3 Sätzen: was gesagt
wird, welche Zahl Rückfragen provoziert, Übergang zur nächsten Folie. Notizen
erscheinen nur in der Referentenansicht, nie auf der Projektion.

## Bilder

Bilder liegen in `images/`. Verwende nur Dateien, die dort wirklich existieren —
vorher auflisten. Jedes `<img>` braucht ein inhaltlich beschreibendes `alt`.
Erfinde keine Dateinamen. Fehlt ein in der Quelle erwähntes Bild: Folie ohne
Bild bauen und im Bericht vermerken.

## Reihenfolge

Behalte die Reihenfolge der Quelle bei. Umsortieren nur, wenn die Quelle selbst
eine andere Gliederung vorgibt (z. B. ein Inhaltsverzeichnis) — dann im Bericht
begründen.

## Theme

Das aktive Theme wird nicht verändert. Deine Folien müssen in allen fünf Themes
funktionieren, deshalb: keine festen Farben, keine Pixelangaben, keine
Inline-Styles für Layout.

## Verifikation (verpflichtend, vor dem Bericht)

1. Server im Projektordner starten: `python -m http.server 8777`
2. `http://localhost:8777` im Browser öffnen, Viewport 1600×900.
3. **Jede** Folie einzeln ansteuern (`#/1`, `#/2`, …), alle Fragmente
   durchklicken, Screenshot machen. Prüfen:
   - Kein Text läuft aus der Folie heraus oder überlappt.
   - Alle Fragmente werden sichtbar, keine Lücke in der Nummerierung.
   - Bilder laden (kein kaputtes Bild-Icon).
   - Folienzähler unten rechts zeigt die erwartete Gesamtzahl.
4. Konsole auf Fehler prüfen.
5. Eine Folie zusätzlich im Theme `brutal` ansehen (Taste `V` bzw.
   `Deck.setTheme('brutal')`) — dort sind Überschriften am größten, hier fällt
   Überlauf zuerst auf.

Erst wenn das sauber ist, bist du fertig. Fixe gefundene Überläufe durch
Kürzen des Textes oder Splitten der Folie, nicht durch CSS.

## Bericht am Ende

- Anzahl Folien, in Stichworten die Gliederung
- Welche Folien du gesplittet oder gekürzt hast
- Jede Stelle, an der Inhalt der Quelle fehlte oder unklar war
- Jeder Punkt, für den das vorhandene Inventar nicht gereicht hat
- Was du geprüft hast und was nicht

## Quelle

<!-- HIER EINTRAGEN: Datei(en), Seitenbereich, Ordner oder Text.
     Beispiele:
       "Smart Home.pdf", Seiten 1–14, alle Kapitel außer Anhang
       content/vortrag.md — Überschriftenebene 2 = eine Folie
       Der folgende Text: … -->

--- PROMPT ENDE ---
