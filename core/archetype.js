// Turns scale values into an archetype name like "The Tidy Rebel".
// Placeholder word lists: rewrite these in your own voice.
window.WYT = window.WYT || {};

WYT.archetype = function (v) {
  const adjectives = [
    ['order',     'Unruly',  'Tidy'],
    ['density',   'Minimal', 'Maximal'],
    ['precision', 'Scrappy', 'Exacting'],
  ];
  let best = adjectives[0], bestDev = -1;
  for (const a of adjectives) {
    const d = Math.abs(v[a[0]] - 0.5);
    if (d > bestDev) { bestDev = d; best = a; }
  }
  const adjective = v[best[0]] >= 0.5 ? best[2] : best[1];
  const loud = v.boldness >= 0.5, playful = v.play >= 0.5;
  const noun = loud ? (playful ? 'Rebel' : 'Headliner') : (playful ? 'Doodler' : 'Archivist');
  return { name: `The ${adjective} ${noun}`, adjective, noun };
};

// The answers that gave you away the most.
WYT.giveaways = function (profile, n = 3) {
  return [...profile.moves].sort((a, b) => b.deviation - a.deviation).slice(0, n);
};

// Grade = how committed you were on a scale, not whether you were "right".
WYT.grade = function (x) {
  const d = Math.abs(x - 0.5) * 2;
  return d > 0.75 ? 'A+' : d > 0.5 ? 'A' : d > 0.3 ? 'B' : d > 0.12 ? 'C' : 'D';
};
