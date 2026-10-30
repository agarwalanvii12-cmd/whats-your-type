// PITCH 1: THE PENCIL CASE
// "Unzip the pencil case. Every piece of stationery has a design test for you."
// Prototype scope: Ruler (margin test) + Scissors (crop it) -> sticker sheet.
// To add: Tape, Compass, Eraser, Highlighter.

const { INK, PAPER, RED } = WYT.ui;
let quiz, morph;

function setup() {
  createCanvas(900, 600).parent('stage');
  morph = new WYT.FontMorph(document.getElementById('morph'));
  quiz = WYT.runQuiz({
    intro: { cta: 'unzip it', draw: drawIntro },
    questions: [rulerQuestion(), scissorsQuestion()],
    onAnswer: (p) => morph.setTarget(p),
    result: stickerSheet(),
  });
}

function draw() { quiz.draw(); }
function mousePressed() { quiz.pressed(); }
function mouseDragged() { quiz.dragged(); }
function mouseReleased() { quiz.released(); }

// ---------------------------------------------------------------- intro
function drawIntro() {
  background(PAPER);
  noStroke(); fill(INK);
  textAlign(CENTER, CENTER);
  textFont('Roboto Flex'); textSize(46);
  text('The Pencil Case', width / 2, 70);
  WYT.ui.greyBox('pencil case drawing, zipped shut', width / 2 - 230, 120, 460, 250);
  textFont('Space Mono'); textSize(15);
  text('Every piece of stationery has a design test for you.\nTogether they work out your type.', width / 2, 420);
}

// ---------------------------------------------------------------- ruler: the margin test
function rulerQuestion() {
  let margin = 20, dragging = false, touched = false;
  const poster = { x: 520, y: 160, w: 260, h: 340 };
  const track = { x: 60, y: 520, w: 400 };
  const RW = 130;
  const rulerX = () => map(margin, 8, 80, track.x, track.x + track.w - RW);

  return {
    title: 'Ruler: the margin test',
    draw() {
      background(PAPER);
      WYT.ui.host('ruler', 'Margins. How much room does this poster get to breathe? Drag me left or right.', 'Space Mono', 17);

      // poster
      stroke(INK); strokeWeight(2); fill(255);
      rect(poster.x, poster.y, poster.w, poster.h);
      const m = margin, iw = poster.w - 2 * m, ih = poster.h - 2 * m;
      noStroke(); fill(RED);
      rect(poster.x + m, poster.y + m, iw, ih * 0.55);
      fill(INK); textFont('Roboto Flex'); textAlign(LEFT, TOP);
      textSize(constrain(iw / 6.2, 16, 40));
      text('OPEN\nSTUDIO', poster.x + m, poster.y + m + ih * 0.6, iw, ih * 0.4);

      // margin readout
      textFont('Space Mono'); textSize(13); textAlign(LEFT, CENTER);
      text(`margin: ${Math.round(margin)}px`, track.x, track.y - 50);

      // track + ruler
      stroke(INK); strokeWeight(1); line(track.x, track.y, track.x + track.w, track.y);
      for (let t = 0; t <= 20; t++) {
        const x = track.x + (t / 20) * track.w;
        line(x, track.y, x, track.y - (t % 5 === 0 ? 10 : 5));
      }
      WYT.ui.greyBox('ruler (drag me)', rulerX(), track.y - 32, RW, 26);
    },
    pressed() {
      if (WYT.ui.over(rulerX() - 10, track.y - 40, RW + 20, 50)) dragging = true;
    },
    dragged() {
      if (!dragging) return;
      margin = constrain(map(mouseX - RW / 2, track.x, track.x + track.w - RW, 8, 80), 8, 80);
      touched = true;
    },
    released() { dragging = false; },
    ready() { return touched; },
    commit() {
      const t = (margin - 8) / 72;
      return {
        move: `gave the poster ${Math.round(margin)}px of breathing room`,
        nudges: { density: 1 - t, order: 0.3 + 0.5 * t },
      };
    },
  };
}

// ---------------------------------------------------------------- scissors: crop it
function scissorsQuestion() {
  const ph = { x: 200, y: 160, w: 500, h: 320 };
  let a = null, b = null, cutting = false;
  const clampPt = () => ({ x: constrain(mouseX, ph.x, ph.x + ph.w), y: constrain(mouseY, ph.y, ph.y + ph.h) });
  const crop = () => a && b && {
    x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y),
  };

  function drawPhoto() {
    // stand-in "photo" built from shapes so cropping actually means something
    noStroke(); fill('#bfe0f2'); rect(ph.x, ph.y, ph.w, ph.h);
    fill('#ffd23f'); circle(ph.x + ph.w * 0.68, ph.y + ph.h * 0.32, 70);
    fill('#7fb069'); rect(ph.x, ph.y + ph.h * 0.7, ph.w, ph.h * 0.3);
    fill(INK); rect(ph.x + ph.w * 0.3, ph.y + ph.h * 0.42, 26, ph.h * 0.3); // a little figure
    circle(ph.x + ph.w * 0.3 + 13, ph.y + ph.h * 0.38, 26);
  }

  return {
    title: 'Scissors: crop it',
    draw() {
      background(PAPER);
      WYT.ui.host('scissors', 'snip snip. drag a cut line across the photo. what stays?', 'Roboto Flex', 20);
      drawPhoto();
      const c = crop();
      if (c && c.w > 4 && c.h > 4) {
        // dim what gets cut away
        noStroke(); fill(251, 248, 241, 200);
        rect(ph.x, ph.y, ph.w, c.y - ph.y);
        rect(ph.x, c.y + c.h, ph.w, ph.y + ph.h - c.y - c.h);
        rect(ph.x, c.y, c.x - ph.x, c.h);
        rect(c.x + c.w, c.y, ph.x + ph.w - c.x - c.w, c.h);
        noFill(); stroke(INK); strokeWeight(2);
        drawingContext.setLineDash([8, 6]);
        rect(c.x, c.y, c.w, c.h);
        drawingContext.setLineDash([]);
      }
    },
    pressed() {
      if (WYT.ui.over(ph.x, ph.y, ph.w, ph.h)) { a = clampPt(); b = clampPt(); cutting = true; }
    },
    dragged() { if (cutting) b = clampPt(); },
    released() { cutting = false; },
    ready() { const c = crop(); return !!c && c.w * c.h > ph.w * ph.h * 0.02; },
    commit() {
      const c = crop();
      const tight = 1 - (c.w * c.h) / (ph.w * ph.h);
      const dx = (c.x + c.w / 2 - (ph.x + ph.w / 2)) / (ph.w / 2);
      const dy = (c.y + c.h / 2 - (ph.y + ph.h / 2)) / (ph.h / 2);
      const off = Math.min(1, Math.hypot(dx, dy));
      return {
        move: `${tight > 0.6 ? 'cropped in tight' : 'kept most of the frame'}${off > 0.35 ? ' and pushed it off-centre' : ' and kept it centred'}`,
        nudges: { boldness: tight, order: 1 - off, play: off },
      };
    },
  };
}

// ---------------------------------------------------------------- result: sticker sheet
function stickerSheet() {
  let arch, stickers = [], comment = '...';
  return {
    enter(profile) {
      const v = WYT.snapshot(profile);
      arch = WYT.archetype(v);
      stickers = WYT.giveaways(profile, 3);
      WYT.nameSpecimen(document.getElementById('specimen'), WYT.axesFor(v));
      WYT.writeComment({ voice: 'stationery', profile, archetype: arch }).then(t => { comment = t; });
    },
    draw() {
      background('#f4efe4');
      stroke(INK); strokeWeight(2); fill(255);
      rect(40, 30, width - 80, height - 60, 18);
      noStroke(); fill(INK); textAlign(CENTER, CENTER);
      textFont('Space Mono'); textSize(12);
      text('STICKER SHEET No. 1', width / 2, 52);
      textFont('Roboto Flex'); textSize(34);
      text(arch.name, width / 2, 250);

      // stickers of the choices that gave you away
      const sw = 220, gap = 30, x0 = width / 2 - (stickers.length * sw + (stickers.length - 1) * gap) / 2;
      stickers.forEach((s, k) => {
        const x = x0 + k * (sw + gap), y = 300;
        push();
        translate(x + sw / 2, y + 55); rotate((k - 1) * 0.06);
        noStroke(); fill(0, 40); rect(-sw / 2 + 5, -50, sw, 110, 22);
        stroke(INK); strokeWeight(2); fill(['#ffe14d', '#ff8fb1', '#9ad1f5'][k % 3]);
        rect(-sw / 2, -55, sw, 110, 22);
        noStroke(); fill(INK); textFont('Space Mono'); textSize(13); textAlign(CENTER, CENTER);
        text('you ' + s.move, -sw / 2 + 14, -45, sw - 28, 90);
        pop();
      });

      fill(INK); textFont('Space Mono'); textSize(14); textAlign(CENTER, TOP);
      text(comment, 90, 455, width - 180, 90);
    },
  };
}
