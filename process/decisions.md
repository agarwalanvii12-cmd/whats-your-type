# Design decisions

A running log for the documentation (process drawer / teacher's edition / back issues).
Newest at the bottom. One line per decision, with the *why*.

## 2026-10-30
- Renamed v2 from *What The Font* to **What's Your Type?**, which works as both a typography pun and a personality question.
- v2 is a **designer's** personality test: it scores graphic-design choices (layout, cropping, spacing, paper) instead of asking about personality directly.
- Three concept pitches: The Pencil Case, The Type Report Card, The Zine Club.
- Built **one shared engine** (`core/`) with three thin skins, so the concepts can be compared on feel rather than on how much code each one got.
- **5 hidden scales**: order, density, boldness, play, precision. Each answer nudges some of them.
- The **font is a variable font** (Roboto Flex) whose weight, width and slant are driven by the scales, so the result is generated from your answers, not picked from a list.
- Illustrations are **grey boxes for now**: the final drawings will be hand-made so it doesn't look AI-generated.
- The OpenAI key is kept out of the public repo; the AI comment goes through a proxy, with a template fallback.

## Next
- [ ] Playtest all three prototypes with 3 to 5 people. Note which one they finish and what they say.
- [ ] Pick one concept.
