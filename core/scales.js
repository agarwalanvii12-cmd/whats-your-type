// The 5 hidden scales. Every question, in every skin, scores ONLY through these.
// Values run 0..1. 0.5 = no opinion yet.
window.WYT = window.WYT || {};

WYT.SCALES = {
  order:     { low: 'loose',    high: 'tidy',     subject: 'Tidiness' },
  density:   { low: 'sparse',   high: 'packed',   subject: 'Page Packing' },
  boldness:  { low: 'quiet',    high: 'loud',     subject: 'Volume' },
  play:      { low: 'serious',  high: 'playful',  subject: 'Mischief' },
  precision: { low: 'gestural', high: 'exact',    subject: 'Penmanship' },
};

WYT.createProfile = function () {
  const scales = {};
  for (const k in WYT.SCALES) scales[k] = { sum: 0, weight: 0 };
  return { scales, moves: [] };
};

// nudges: { order: 0.8 } or { order: [0.8, 2] } for a weighted answer.
// move: a verb phrase that reads after "You ...", e.g. "cropped in tight".
WYT.record = function (profile, { question, move, nudges }) {
  let dev = 0, n = 0;
  for (const [k, raw] of Object.entries(nudges || {})) {
    if (!profile.scales[k]) { console.warn('unknown scale:', k); continue; }
    const [val, w] = Array.isArray(raw) ? raw : [raw, 1];
    const v = Math.min(1, Math.max(0, val));
    profile.scales[k].sum += v * w;
    profile.scales[k].weight += w;
    dev += Math.abs(v - 0.5);
    n++;
  }
  // deviation = how strongly this answer gave you away (used for stickers / evidence)
  profile.moves.push({ question, move, deviation: n ? dev / n : 0 });
};

WYT.value = function (profile, k) {
  const s = profile.scales[k];
  return s.weight ? s.sum / s.weight : 0.5;
};

WYT.snapshot = function (profile) {
  const out = {};
  for (const k in WYT.SCALES) out[k] = WYT.value(profile, k);
  return out;
};
