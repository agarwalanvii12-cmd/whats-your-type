# What's Your Type?

A designer's personality test. Make a few design decisions, and the quiz works out your type:
a font, an archetype, and the moves that gave you away.

Version 2 of *What The Font*, for NUS ID2116 Computing for Design (Project 02).

## Three pitches, one engine
| Pitch | Idea | Prototype |
|---|---|---|
| The Pencil Case | Each piece of stationery runs a design test | Ruler + Scissors -> sticker sheet |
| The Type Report Card | Design homework, graded in fonts | Spacing 101 + Detention -> report card |
| The Zine Club | Lay out a zine; bind it to get your type | Cut & paste + paper -> stapled cover |

All three share `core/`: the 5 hidden scales, the live font morph, archetype naming and the AI comment.
The prototypes use grey boxes where hand-drawn illustrations will go.

## Run it
```
python3 -m http.server
```
Open http://localhost:8000. Or enable GitHub Pages (Settings -> Pages -> Deploy from branch `main`, folder `/root`).

## AI comment
Set `aiEndpoint` in `config.js` to a serverless proxy that holds the OpenAI key and returns `{ "text": "..." }`.
Without it, a built-in template writes the comment. **Never commit an API key.**

## Process
Design decisions are logged in [`process/decisions.md`](process/decisions.md).
