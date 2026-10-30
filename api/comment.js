// Vercel serverless function: POST /api/comment
// Holds the OpenAI key server-side (env var OPENAI_API_KEY, set in the Vercel dashboard),
// so the key never appears in this public repo or in the browser.
//
// Request body (sent by core/ai.js):
//   { voice: 'stationery' | 'teacher' | 'zine', archetype: 'The Tidy Rebel',
//     values: { order: 0.8, ... }, moves: ['cropped in tight', ...] }
// Response: { text: '...' }

// Sites allowed to call this. Add your GitHub Pages / custom domain here.
const ALLOWED_ORIGINS = [
  'https://agarwalanvii12-cmd.github.io',
  'http://localhost:8000',
];

// The voices are fixed here, server-side, so nobody can use this endpoint as a free general chatbot.
const VOICES = {
  stationery:
    'You are a chatty pencil case full of stationery characters. In 2 short sentences, tell the user what their design choices say about them as a designer. Mention at least one of their actual moves. Playful, a little cheeky, never mean.',
  teacher:
    "You are a dramatic design teacher writing a comment on a student's report card in red pen. In 2 short sentences, react to their actual design moves and their archetype. Sound like a real teacher: dry, a bit theatrical, secretly proud.",
  zine:
    'You are the editor of a scrappy photocopied zine. Write a 2-sentence editor\'s note about the person who made this issue, based on their actual design moves and archetype. Lowercase, DIY, warm.',
};

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function cors(req, res) {
  const origin = req.headers.origin || '';
  const ok = ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
  if (ok) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Keep inputs small and plain, so the prompt can't be stuffed or hijacked.
function clean(s, max) {
  return String(s || '').replace(/[\r\n]+/g, ' ').slice(0, max);
}

module.exports = async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not set' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const voice = VOICES[body.voice] ? body.voice : 'stationery';
  const archetype = clean(body.archetype, 40);
  const moves = (Array.isArray(body.moves) ? body.moves : []).slice(0, 5).map(m => clean(m, 120));
  const values = Object.entries(body.values || {})
    .slice(0, 5)
    .map(([k, v]) => `${clean(k, 12)}: ${Number(v).toFixed(2)}`)
    .join(', ');

  const userPrompt =
    `Archetype: ${archetype}\n` +
    `Scales (0 to 1): ${values}\n` +
    `Their moves: ${moves.map(m => '- you ' + m).join('\n')}`;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        temperature: 0.9,
        messages: [
          { role: 'system', content: VOICES[voice] + ' Never use em dashes.' },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!r.ok) {
      console.error('OpenAI error', r.status, await r.text());
      return res.status(502).json({ error: 'AI request failed' });
    }
    const j = await r.json();
    const text = (j.choices?.[0]?.message?.content || '').trim();
    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'AI request failed' });
  }
};
