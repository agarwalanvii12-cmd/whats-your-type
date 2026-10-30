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

## AI comment (Vercel proxy)
`api/comment.js` is a serverless function that calls OpenAI with a key stored in Vercel, never in this repo.
1. vercel.com -> Add New -> Project -> import this repo. Framework preset: **Other**. No build command.
2. Before deploying, add Environment Variable `OPENAI_API_KEY` = your key.
3. Deploy. The Vercel site uses the AI comment automatically.
4. For the GitHub Pages copy, set `VERCEL_URL` in `config.js` to your Vercel URL.

Without a proxy, a built-in template writes the comment. **Never commit an API key.**

## Process
Design decisions are logged in [`process/decisions.md`](process/decisions.md).
