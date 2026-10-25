# Deck — interaktives HTML-Präsentationssystem

Reines HTML/CSS/JS, kein Build, keine Abhängigkeiten. Folien werden in
1920×1080 geschrieben und auf jede Bildschirmgröße skaliert.

## Starten

```bash
cd "/Users/Tim/Slides Nils" && python3 -m http.server 8777
```

Dann `http://localhost:8777` öffnen, **F** für Vollbild.

Lokaler Server nötig (Themes + Fonts laden per CSS-`@import`; `file://`
reicht nicht zuverlässig).

## Dateien

| Pfad | Inhalt |
|---|---|
| `index.html` | Folien + Chrome-Markup (190 Folien, Vortrag „Smart Home") |
| `Smart Home - überarbeitet.md` | Inhaltsquelle, folienweise gegliedert |
| `build/part-*.html` | Zwischenstände je Vortragsteil, aus denen `index.html` zusammengesetzt wurde |
| `js/engine.js` | Navigation, Fragmente, Skalierung, Themes, Overview, Deep Links |
| `js/tools.js` | Laser, Spotlight, Zeichnen |
| `css/core.css` | Layout, Transitions, Bedien-Oberfläche (themeneutral) |
| `css/themes/*.css` | 5 Designvarianten |
| `presenter.html` | Referentenansicht (zweites Fenster) |

## Shortcuts

**Navigation** — `→` / `Space` / Klick / Wischen vor · `←` zurück ·
`1`–`9` Folie direkt · `Home` / `End` · `O` oder `Tab` Übersichtsraster ·
`F` Vollbild · `B` Schwarzbild · `T` Timer · `S` Referentenansicht ·
`?` Hilfe · `Esc` Modus beenden.

**Werkzeuge** — `D` Zeichnen · `1`–`6` Farbe/Marker (im Zeichenmodus) ·
`Z` letzter Strich zurück · `X` Folie leeren · `⇧X` alles leeren ·
`L` Laserpointer · `M` Spotlight (Mausrad = Größe) · `C` Theme-Leiste ·
`V` nächstes Theme.

## Folie schreiben

```html
<section class="slide" data-transition="slide" data-fragment-mode="dim-prior">
  <p class="kicker">Rubrik</p>
  <h2>Überschrift</h2>
  <ul>
    <li data-fragment="1">Erster Punkt</li>
    <li data-fragment="2">Zweiter Punkt</li>
  </ul>
  <div class="notes">Nur in der Referentenansicht sichtbar.</div>
</section>
```

- `data-transition`: `fade` · `slide` · `zoom` · `rise` (Default `fade`)
- `data-fragment="n"`: Element erscheint beim n-ten Weiter-Klick
- `data-fragment-style`: `grow` · `blur` (Default: von unten einblenden)
- `data-fragment-mode="dim-prior"` auf der Folie: ältere Fragmente dimmen
- `.slide--center` zentriert Inhalt
- `.slide--media` stellt Bild und Text nebeneinander (für Hochkant-Screenshots).
  Erwartet genau zwei Kinder: `<figure>` zuerst, danach ein `<div>` mit
  Kicker, Überschrift und Text — die `.notes` zählen nicht mit.

Bausteine: `.cols` / `.cols--3` / `.cols--4` (Raster), `.card`,
`.metric` (große Zahl), `.kicker`, `.lead`.

## Interaktive Folien

Beliebiges JS in `index.html` oder in einer eigenen Datei. Wichtig:
Klicks auf Bedienelemente mit `stopPropagation()` abfangen, sonst
blättert die Engine weiter. Beispiel: Amortisationsrechner auf Folie 6.

Pro Folie beim Betreten feuert `deck:enter` — guter Haken für
Animationen, die erst beim Aufschlagen starten sollen:

```js
document.addEventListener('deck:enter', (e) => {
  if (e.detail.index === 2) startChartAnimation();
});
```

API im Konsolenzugriff: `Deck.next()`, `Deck.show(3)`, `Deck.setTheme('glass')`,
`DeckTools.setLaser(true)`.

## Referentenansicht

`S` öffnet `presenter.html` in einem zweiten Fenster: Notizen, nächste
Folie, Timer, Vor/Zurück-Knöpfe. Kopplung über `BroadcastChannel` —
beide Fenster müssen von derselben Origin kommen (also vom Server, nicht
von `file://`). Dieses Fenster auf den Laptop, das Deck auf den Beamer.

## Themes

`aurora` (dunkel, Verlauf) · `editorial` (hell, Serifen) ·
`brutal` (Gelb/Schwarz, harte Kanten) · `terminal` (Mono, Grün) ·
`glass` (hell, Milchglas).

Theme-Wahl landet in `localStorage`. Neues Theme = neue Datei in
`css/themes/`, die die Variablen aus `:root` überschreibt, plus Eintrag
im `THEMES`-Array in `js/engine.js`.

## Grenzen (Stand jetzt)

- Zeichen-Striche leben nur im Speicher: Reload löscht sie.
- Deep Link `#/3/2` setzt Folie und Fragment; die Fragmentzahl wandert
  beim Weiterklicken nicht in die URL.
- Kein PDF-Export.
- Nach CSS-Änderungen `DECK_VERSION` in `js/engine.js` hochzählen und
  `css/core.css?v=` in `index.html` angleichen, sonst zieht der Browser
  alte Stylesheets.
