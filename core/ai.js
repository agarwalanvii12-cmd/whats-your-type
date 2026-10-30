// AI-written result comment.
// NEVER put an OpenAI key in this repo: GitHub Pages is public, so anyone could read it.
// Instead set WYT_CONFIG.aiEndpoint (config.js) to a small serverless proxy that holds the key.
// With no endpoint, a local template is used so the site always works.
window.WYT = window.WYT || {};

(function () {
  function fallback(voice, arch, moves) {
    const m = moves.map(x => x.move);
    const ev = m.length > 1 ? `You ${m[0]}, and you ${m[1]}.`
             : m.length ? `You ${m[0]}.` : 'You barely touched anything.';
    if (voice === 'teacher') return `${ev} Very ${arch.adjective.toLowerCase()} of you. ${arch.noun} behaviour noted. See me after class.`;
    if (voice === 'zine') return `${ev} This issue was made by ${arch.name.replace('The ', 'a ')}. Photocopy responsibly.`;
    return `${ev} The pencil case has spoken: ${arch.name}.`;
  }

  // voice: 'stationery' | 'teacher' | 'zine'
  WYT.writeComment = async function ({ voice, profile, archetype }) {
    const moves = WYT.giveaways(profile);
    const endpoint = (window.WYT_CONFIG || {}).aiEndpoint;
    if (endpoint) {
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voice,
            archetype: archetype.name,
            values: WYT.snapshot(profile),
            moves: moves.map(m => m.move),
          }),
        });
        if (r.ok) {
          const j = await r.json();
          if (j.text) return j.text;
        }
      } catch (e) {
        console.warn('AI endpoint failed, using fallback comment', e);
      }
    }
    return fallback(voice, archetype, moves);
  };
})();
