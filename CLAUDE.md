# What's Your Type? (v2)

A designer's personality test for NUS ID2116 Computing for Design, Project 02.
The quiz reads your graphic-design choices (margins, crops, layouts, paper, type) and
gives you a font + archetype. Built in p5.js, hosted on GitHub Pages.

## Structure
- `core/` shared engine. Every skin uses it. Don't duplicate its logic inside a skin.
  - `scales.js` the 5 hidden scales: order, density, boldness, play, precision (0..1)
  - `quiz.js` state machine: INTRO -> QUESTION[i] -> RESULT
  - `fontMorph.js` scales -> Roboto Flex axes (wght, wdth, slnt), live morph, name specimen
  - `archetype.js` archetype naming, giveaway moves, grades
  - `ai.js` result comment via `WYT_CONFIG.aiEndpoint`, local template fallback
  - `ui.js` buttons, grey boxes, speech bubbles, hosts
- `pencil-case/`, `report-card/`, `zine-club/` one skin per pitch (`index.html` + `sketch.js`)
- `assets/` Anvii's own drawings. `process/` design-decision log for the documentation.

## Rules
- **p5.js 2.x** (CDN `p5@2`). `bezierVertex` no longer takes 6 args: use `vertex()` polygons.
- **Look:** hand-drawn stationery, scrappy, whimsical, high-graphic. NO gradients, glassmorphism,
  rounded SaaS cards, drop-shadow blur, emoji icons, or "AI website" defaults. Hard offset shadows
  and flat colour are fine.
- **Illustrations come from `/assets` only** (Anvii draws them). Never generate placeholder art.
  Until a drawing exists, use `WYT.ui.greyBox('label', ...)`.
- **Scoring only through `WYT.record` / question `commit()`** returning `{ move, nudges }`.
  `move` is a verb phrase that reads after "You ...". Never hardcode scoring elsewhere.
- **Variable fonts only via `core/fontMorph.js`.** Canvas text can't do variable axes; morphing type lives in the DOM.
- **No secrets in the repo.** It's public. The OpenAI key lives in a serverless proxy; `config.js` holds only its URL.
- **One feature per commit**, with a message that explains the design decision, not just the code.
  The git history is part of the process documentation.
- When a design decision is made, add a dated line to `process/decisions.md`.
- Keep code readable for a design student: short functions, comments that explain *why*.

## Adding a question
Write a function returning `{ title, enter?, draw, pressed?, dragged?, released?, ready, commit }`
and add it to the `questions` array in that skin's `setup()`. See `rulerQuestion()` in `pencil-case/sketch.js`.

## Run locally
`python3 -m http.server` in the repo root, then open http://localhost:8000.
