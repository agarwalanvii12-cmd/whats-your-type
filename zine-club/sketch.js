// PITCH 3: THE ZINE CLUB
// "Make a zine, one spread at a time. When you bind it, it tells you your type."
// Prototype scope: Cut & paste + Pick your paper -> staple + zine cover.
// To add: headline builder, sticker name tags, photocopier glitch, print-ready PDF.

const { INK, PAPER, RED } = WYT.ui;
const RISO_PINK = '#ff7fae';
let quiz, morph;
let paper = 'plain';
const placed = []; // cut-outs pasted onto the spread
const spread = { x: 150, y: 150, w: 600, h: 330 };

function setup() {
  createCanvas(900, 600).parent('stage');
  morph = new WYT.FontMorph(document.getElementById('morph'));
  quiz = WYT.runQuiz({
    intro: { cta: 'join the club', draw: drawIntro },
    questions: [cutAndPaste(), pickPaper()],
    onAnswer: (p) => morph.setTarget(p),
    result: binding(),
  });
}

function draw() { quiz.draw(); }
function mousePressed() { quiz.pressed(); }
function mouseDragged() { quiz.dragged(); }
function mouseReleased() { quiz.released(); }

// ---------------------------------------------------------------- shared drawing
function drawPaper(type, x, y, w, h) {
  push();
  stroke(INK); strokeWeight(2);
  fill(type === 'kraft' ? '#c9a878' : type === 'riso' ? RISO_PINK : 255);
  rect(x, y, w, h);
  strokeWeight(1);
  if (type === 'lined') {
    stroke('#a9cbe8');
    for (let ly = y + 22; ly < y + h; ly += 22) line(x, ly, x + w, ly);
  } else if (type === 'grid') {
    stroke('#cfd8dc');
    for (let gx = x + 20; gx < x + w; gx += 20) line(gx, y, gx, y + h);
    for (let gy = y + 20; gy < y + h; gy += 20) line(x, gy, x + w, gy);
  } else if (type === 'kraft') {
    randomSeed(7); noStroke(); fill(90, 60, 30, 60);
    for (let k = 0; k < (w * h) / 900; k++) circle(x + random(w), y + random(h), random(1, 3));
  }
  pop();
}

function drawSpread() {
  drawPaper(paper, spread.x, spread.y, spread.w, spread.h);
  stroke(INK); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(spread.x + spread.w / 2, spread.y, spread.x + spread.w / 2, spread.y + spread.h);
  drawingContext.setLineDash([]);
  for (const it of placed) drawCutout(it);
}

function drawCutout(it) {
  push();
  translate(it.x, it.y); rotate(it.r);
  noStroke(); fill(0, 35); rect(-it.w / 2 + 4, -it.h / 2 + 4, it.w, it.h);
  WYT.ui.greyBox(it.label, -it.w / 2, -it.h / 2, it.w, it.h);
  pop();
}

function heading(title, line2) {
  background(PAPER);
  noStroke(); fill(INK); textAlign(LEFT, BASELINE);
  textFont('Roboto Flex'); textSize(34); text(title, 40, 62);
  textFont('Space Mono'); textSize(14); text(line2, 40, 96);
}

function drawIntro() {
  heading('The Zine Club', 'Make a zine, one spread at a time. When you bind it, it tells you your type.');
  WYT.ui.greyBox('club table: scissors, glue, a stack of paper', 150, 140, 600, 300);
}

// ---------------------------------------------------------------- spread 1: cut & paste
function cutAndPaste() {
  const tray = ['photo', 'star', 'paper clip', 'ticket', 'flower', 'tape'].map((label, k) => ({
    label, used: false, x: 70 + k * 100, y: 500, w: 84, h: 64,
  }));
  let held = null, grabDX = 0, grabDY = 0;

  return {
    title: 'Spread 1: cut & paste',
    draw() {
      heading('Spread 1: cut & paste', 'Drag cut-outs onto the spread. Add as much or as little as you like.');
      drawSpread();
      for (const t of tray) if (!t.used) WYT.ui.greyBox(t.label, t.x, t.y, t.w, t.h);
    },
    pressed() {
      // pick up something already on the page (topmost first)
      for (let k = placed.length - 1; k >= 0; k--) {
        const it = placed[k];
        if (dist(mouseX, mouseY, it.x, it.y) < Math.max(it.w, it.h) / 2) {
          held = it; grabDX = mouseX - it.x; grabDY = mouseY - it.y;
          placed.push(placed.splice(k, 1)[0]);
          return;
        }
      }
      // or cut a new one out of the tray
      for (const t of tray) {
        if (!t.used && WYT.ui.over(t.x, t.y, t.w, t.h)) {
          t.used = true;
          held = { label: t.label, x: mouseX, y: mouseY, w: t.w * 1.4, h: t.h * 1.4, r: random(-0.3, 0.3) };
          grabDX = grabDY = 0;
          placed.push(held);
          return;
        }
      }
    },
    dragged() { if (held) { held.x = mouseX - grabDX; held.y = mouseY - grabDY; } },
    released() {
      // dropped outside the spread = back to the tray
      if (held && !WYT.ui.over(spread.x - 40, spread.y - 40, spread.w + 80, spread.h + 80)) {
        placed.splice(placed.indexOf(held), 1);
        tray.find(t => t.label === held.label).used = false;
      }
      held = null;
    },
    ready() { return true; }, // pasting nothing is also an answer
    commit() {
      const n = placed.length;
      if (n === 0) return { move: 'left the spread completely bare', nudges: { density: 0, order: 0.7, boldness: 0.2 } };
      const tilt = placed.reduce((s, it) => s + Math.abs(it.r), 0) / n / 0.3;
      const offEdge = placed.filter(it =>
        (it.x - it.w / 2 < spread.x || it.x + it.w / 2 > spread.x + spread.w ||
         it.y - it.h / 2 < spread.y || it.y + it.h / 2 > spread.y + spread.h)).length / n;
      return {
        move: `pasted ${n} thing${n > 1 ? 's' : ''} onto the spread${offEdge > 0.3 ? ', some hanging off the edge' : ''}`,
        nudges: { density: n / tray.length, play: tilt, order: 1 - offEdge },
      };
    },
  };
}

// ---------------------------------------------------------------- spread 2: pick your paper
function pickPaper() {
  const papers = [
    { id: 'lined', label: 'lined',     nudges: { order: 0.7, precision: 0.6 } },
    { id: 'grid',  label: 'grid',      nudges: { order: 0.9, precision: 0.9 } },
    { id: 'kraft', label: 'kraft',     nudges: { precision: 0.2, play: 0.5, boldness: 0.35 } },
    { id: 'riso',  label: 'riso pink', nudges: { play: 0.9, boldness: 0.85 } },
  ];
  const sw = (k) => ({ x: 60 + k * 150, y: 500, w: 120, h: 72 });
  let chosen = null;

  return {
    title: 'Spread 2: pick your paper',
    draw() {
      heading('Spread 2: pick your paper', 'What does your zine get printed on?');
      drawSpread();
      papers.forEach((p, k) => {
        const b = sw(k);
        drawPaper(p.id, b.x, b.y, b.w, b.h);
        if (chosen === p) { noFill(); stroke(RED); strokeWeight(3); rect(b.x - 5, b.y - 5, b.w + 10, b.h + 10); }
        noStroke(); fill(INK); textFont('Space Mono'); textSize(12); textAlign(CENTER, TOP);
        text(p.label, b.x + b.w / 2, b.y - 18);
      });
    },
    pressed() {
      papers.forEach((p, k) => {
        const b = sw(k);
        if (WYT.ui.over(b.x, b.y, b.w, b.h)) { chosen = p; paper = p.id; }
      });
    },
    ready() { return !!chosen; },
    commit() { return { move: `printed it on ${chosen.label} paper`, nudges: chosen.nudges }; },
  };
}

// ---------------------------------------------------------------- result: staple + cover
function binding() {
  let arch, comment = '...', t0 = 0;
  const cover = { x: 280, y: 40, w: 340, h: 500 };
  return {
    enter(profile) {
      const v = WYT.snapshot(profile);
      arch = WYT.archetype(v);
      t0 = millis();
      const spec = document.getElementById('specimen');
      spec.style.top = '130px';
      spec.classList.add('small');
      setTimeout(() => WYT.nameSpecimen(spec, WYT.axesFor(v)), 1100);
      WYT.writeComment({ voice: 'zine', profile, archetype: arch }).then(t => { comment = t; });
    },
    draw() {
      background('#e7e1d3');
      const age = millis() - t0;
      drawPaper(paper, cover.x, cover.y, cover.w, cover.h);

      // staple animation: two staples punch down the spine
      const drop = constrain(map(age, 0, 600, -80, 0), -80, 0);
      stroke('#8a8a8a'); strokeWeight(4);
      for (const sy of [cover.y + 120, cover.y + cover.h - 120]) line(cover.x + 6, sy + drop, cover.x + 6, sy + 40 + drop);
      if (age < 1000) return;

      // misregistered riso headline: pink layer a few px off, ink on top
      noStroke(); textAlign(CENTER, CENTER); textFont('Roboto Flex'); textSize(26);
      fill(paper === 'riso' ? '#3355ff' : RISO_PINK);
      text(arch.name, cover.x + cover.w / 2 + 3, cover.y + 300 + 2);
      fill(INK);
      text(arch.name, cover.x + cover.w / 2, cover.y + 300);

      textFont('Space Mono'); textSize(11);
      text('ISSUE #1', cover.x + cover.w / 2, cover.y + 30);
      textSize(12); textAlign(CENTER, TOP);
      text(comment, cover.x + 26, cover.y + 340, cover.w - 52, 140);
    },
  };
}
