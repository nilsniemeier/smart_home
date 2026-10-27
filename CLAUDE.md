# CLAUDE.md

> **Sprache: Deutsch ist immer die Hauptsprache.** Alle Antworten, Rückfragen, Zusammenfassungen, Folieninhalte und Notizen auf Deutsch – auch wenn Tool-Ausgaben, Fehlermeldungen oder diese Datei englisch sind. Englisch nur für Code, Bezeichner und feststehende Fachbegriffe.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single HTML presentation ("Smart Home", by Nils Niemeier, ~181 slides) built on a small home-grown slide engine. Plain HTML/CSS/JS, no build step, no dependencies, no tests or linter. Slides and chat are in **German**; keep answers short and precise. Nils often sends several feedback points in one message — implement directly where intent is clear, don't ask back.

`README.md` (engine usage, shortcuts, slide markup) and `HANDOFF.md` (working conventions, CSS vocabulary, open to-dos) are the primary docs — read them before larger changes. The repo is under git, but on this Windows machine `git` is not on the PowerShell PATH. When slide count or `DECK_VERSION` changes, update the "Stand" line in HANDOFF.md.

## Running

**At the start of every new session, start the server automatically (in the background, without asking) and share the link** `http://localhost:8777/index.html?r=<DECK_VERSION>` with Nils. If port 8777 already responds, just share the link.

```
python -m http.server 8777
```
If `python` resolves to the Windows Store alias (error "Python was not found"), use the full path: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m http.server 8777`.
Open `http://localhost:8777/index.html?r=<version>#/<slide>` (`F` = fullscreen). A server is required — themes/fonts load via CSS `@import` and the presenter view (`presenter.html`, key `S`) talks to the deck via `BroadcastChannel`, both of which fail under `file://`. There is no `.claude/launch.json` preview config in this checkout.

**Deployment:** The deck is published via GitHub Pages from `master` / root at `https://nilsniemeier.github.io/smart_home/` (repo `https://github.com/nilsniemeier/smart_home`). Every push to `master` goes live, including `.notes` (visible in page source) and any leftover `.slide-badge`/`.postit`. Git is available at `$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe`; for push/fetch set `$env:GCM_INTERACTIVE='always'` (the session defaults to `never`, which blocks the credential manager).

Verify every change visually in the browser (screenshot) before calling it done; reveal fragments one keypress (`Right`) at a time. Check overflow especially in the `brutal` theme (`Deck.setTheme('brutal')`), which has the largest headings.

## Mandatory after any CSS/JS change (cache busting)

Bump `DECK_VERSION` in `js/engine.js` **and** update all three query params in `index.html` to the same value: `css/core.css?v=`, `js/hysterese.js?v=`, `js/ifttt.js?v=`. Theme CSS gets the version appended by the engine automatically.

## Architecture

- `index.html` is the **only** source of slides (`<section class="slide">` inside `.deck`). `build/part-*.html` are historical intermediate stages — not maintained, don't edit. `Smart Home - überarbeitet.md` is the slide-by-slide content source; `Smart Home.md`/`.pdf` are the original.
- `js/engine.js` — navigation, fragments, 1920×1080 → viewport scaling, theme switching (`THEMES` array, choice in `localStorage`), overview grid, deep links `#/slide/fragment`, BroadcastChannel sync with `presenter.html`. Fires `deck:enter` on each slide entry (`e.detail.index`); `hysterese.js` / `ifttt.js` (animated diagrams) and `tools.js` (laser, spotlight, drawing) hook into it. Console API: `Deck.next()`, `Deck.show(n)`, `Deck.setTheme(id)`, `DeckTools.*`.
- `css/core.css` — layout, transitions, and all custom components (theme-neutral). `css/themes/*.css` (aurora, editorial, brutal, terminal, glass) only override `:root` variables plus element styling. New theme = new file + entry in `THEMES`.
- Interactive controls on slides must `stopPropagation()` on clicks, or the engine advances.

## Engine/CSS gotchas

- `data-fragment="n"` means the **n-th click**, not the n-th element; elements sharing a number appear together. Number from 1 per slide, no gaps.
- Slides are laid out at 1920×1080; content must fit 1080 px height — overflow is the most common bug. Fix by shortening/splitting, not by shrinking CSS.
- `.slide` is `position:absolute; inset:0` and a column flexbox. Never override it with `position:relative` (slide collapses); side-by-side variants need explicit `flex-direction: row`.
- Themes style `.slide li` / `.slide p`, so custom component selectors often need a `.slide` prefix to win.
- `.slide--media` expects exactly two children: `<figure>` first, then a `<div>` with text (`.notes` doesn't count).
- Status colors: `--ok` / `--mid` / `--bad` on `:root`. See HANDOFF.md for the full list of custom component classes (`.matrix`, `.ctable`, `.flow`, `.roadmap`, `.clipping`, `.slide-badge`, `.postit`, …).

## Editing conventions

- Find slides **by content (heading), never by number** — Nils' slide numbers are often off by 1–3. If unclear, quote the heading and ask.
- Edit `index.html` via small Python scripts that `sys.exit` when an anchor is missing or not unique, to avoid silent mis-edits. Files are UTF-8; in PowerShell pass `-Encoding utf8` explicitly (default output shows mojibake).
- Text removed from a slide moves **completely** into that slide's `<div class="notes">` (presenter-only). Lose nothing.
- Don't invent content; keep numbers exact. Verify external facts via web search and cite the source in the notes.
- Images only from freely licensed sources (Unsplash, Wikimedia Commons) with credit on the slide; no vendor/press graphics. Prefer hand-drawn inline SVG for diagrams (theme-aware, no licensing issues). Only reference files that exist in `images/`.
- Slides must work in all five themes: no hard-coded colors or pixel layout in inline styles.
- `.slide-badge` / `.postit` are internal work markers and must be gone before the talk. Open decisions are tracked under "Offene Punkte" in HANDOFF.md.
