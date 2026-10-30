// PITCH 2: THE TYPE REPORT CARD
// "A school year in 8 assignments. Your design homework gets graded, and the grade is a font."
// Prototype scope: Spacing 101 + Detention (Comic Sans) -> report card.
// To add: Intro to Cropping, Advanced Grid Breaking, pop quiz, seating chart, yearbook photo.

const { INK, PAPER, RED } = WYT.ui;
let quiz, morph;
let redNote = null; // { text, t }

function setup() {
  createCanvas(900, 600).parent('stage');
  morph = new WYT.FontMorph(document.getElementById('morph'));
  quiz = WYT.runQuiz({
    intro: { cta: 'start term', draw: drawIntro },
    questions: [spacing101(), detention()],
    onAnswer: (p, ans) => { morph.setTarget(p); redNote = { text: ans.note, t: millis() }; },
    result: reportCard(),
    overlay: drawRedNote,
  });
}

function draw() { quiz.draw(); }
function mousePressed() { quiz.pressed(); }
function mouseDragged() { quiz.dragged(); }
function mouseReleased() { quiz.released(); }

// ---------------------------------------------------------------- notebook page
function notebook(subject, prompt) {
  background(PAPER);
  stroke('#a9cbe8'); strokeWeight(1);
  for (let y = 120; y < height; y += 28) line(0, y, width, y);
  stroke('#f08a8a'); strokeWeight(2); line(70, 0, 70, height);
  WYT.ui.greyBox('doodle', width - 110, 18, 80, 70);
  noStroke(); fill(INK); textAlign(LEFT, BASELINE);
  textFont('Roboto Flex'); textSize(34); text(subject, 90, 62);
  textFont('Space Mono'); textSize(14); text(prompt, 90, 96);
}

// Teacher's red pen: scribbles a reaction after each answer.
function drawRedNote() {
  if (!redNote) return;
  const age = millis() - redNote.t;
  if (age > 2800) return;
  push();
  translate(width - 280, 150); rotate(-0.08);
  fill(RED); noStroke(); textFont('Caveat'); textSize(34); textAlign(LEFT, TOP);
  drawingContext.globalAlpha = constrain(map(age, 2200, 2800, 1, 0), 0, 1);
  text(redNote.text, 0, 0, 260, 120);
  pop();
}

function drawIntro() {
  notebook('Term 1', 'Design homework. Graded. The grade is a font.');
  WYT.ui.greyBox('classroom: stationery classmates at their desks', 110, 150, 680, 260);
}

// ---------------------------------------------------------------- Spacing 101
function spacing101() {
  let choice = -1;
  const cards = [
    { label: 'A', move: 'packed a tight grid edge to edge', note: 'very tidy. suspicious.',
      nudges: { order: 0.9, density: 0.9, precision: 0.8 } },
    { label: 'B', move: 'left the page almost empty', note: 'brave. or lazy?',
      nudges: { density: 0.1, order: 0.7, boldness: 0.3 } },
    { label: 'C', move: 'broke the grid on purpose', note: 'bold choice!!',
      nudges: { order: 0.1, play: 0.85, boldness: 0.8 } },
  ];
  const box = (k) => ({ x: 110 + k * 240, y: 140, w: 200, h: 260 });

  function thumb(k, b) {
    push(); translate(b.x, b.y);
    noStroke(); fill(INK);
    if (k === 0) {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) rect(14 + c * 59, 40 + r * 52, 54, 48);
    } else if (k === 1) {
      rect(20, b.h - 60, 50, 8); rect(20, b.h - 44, 90, 4);
    } else {
      fill(RED); push(); translate(90, 110); rotate(-0.25); rect(-70, -50, 130, 100); pop();
      fill(INK); push(); translate(120, 170); rotate(0.18); rect(-40, -30, 90, 60); pop();
      rect(20, 30, 60, 14);
    }
    pop();
  }

  return {
    title: 'Spacing 101',
    draw() {
      notebook('Spacing 101', 'Assignment 1: which page would you hand in?');
      cards.forEach((c, k) => {
        const b = box(k);
        stroke(INK); strokeWeight(2); fill(255);
        rect(b.x, b.y, b.w, b.h);
        thumb(k, b);
        if (choice === k) {
          noFill(); stroke(RED); strokeWeight(3);
          ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w + 40, b.h + 36);
        }
        noStroke(); fill(INK); textFont('Space Mono'); textSize(16); textAlign(CENTER, TOP);
        text(c.label, b.x + b.w / 2, b.y + b.h + 12);
      });
    },
    pressed() {
      cards.forEach((c, k) => { const b = box(k); if (WYT.ui.over(b.x, b.y, b.w, b.h)) choice = k; });
    },
    ready() { return choice >= 0; },
    commit() { return cards[choice]; },
  };
}

// ---------------------------------------------------------------- Detention
function detention() {
  let choice = null;
  const opts = {
    crime:   { move: 'called Comic Sans a crime', note: 'harsh. correct?', nudges: { precision: 0.85, play: 0.25 } },
    comfort: { move: 'defended Comic Sans as comfort', note: 'a brave stance. noted.', nudges: { play: 0.9, precision: 0.3 } },
  };
  return {
    title: 'Detention',
    draw() {
      notebook('Detention', 'You will not leave until you answer.');
      noStroke(); fill(INK); textAlign(CENTER, CENTER);
      textFont('Comic Sans MS, Comic Neue, cursive'); textSize(40);
      text('Comic Sans: crime or comfort?', width / 2, 220);
      const f = 'Comic Sans MS, Comic Neue, cursive';
      WYT.ui.button('crime', 'crime', width / 2 - 230, 300, 200, 70, { font: f, size: 26, selected: choice === 'crime' });
      WYT.ui.button('comfort', 'comfort', width / 2 + 30, 300, 200, 70, { font: f, size: 26, selected: choice === 'comfort' });
    },
    pressed() {
      if (WYT.ui.hit('crime')) choice = 'crime';
      if (WYT.ui.hit('comfort')) choice = 'comfort';
    },
    ready() { return !!choice; },
    commit() { return opts[choice]; },
  };
}

// ---------------------------------------------------------------- result: report card
function reportCard() {
  let v, arch, comment = '...';
  return {
    enter(profile) {
      v = WYT.snapshot(profile);
      arch = WYT.archetype(v);
      const spec = document.getElementById('specimen');
      spec.style.top = '50px';
      WYT.nameSpecimen(spec, WYT.axesFor(v), 'student name');
      WYT.writeComment({ voice: 'teacher', profile, archetype: arch }).then(t => { comment = t; });
    },
    draw() {
      background('#e9e2d0');
      stroke(INK); strokeWeight(2); fill('#fffdf6');
      rect(60, 24, width - 120, height - 48);
      noStroke(); fill(INK); textAlign(CENTER, CENTER);
      textFont('Space Mono'); textSize(12); text('REPORT CARD · TERM 1', width / 2, 44);

      textAlign(LEFT, CENTER); textFont('Roboto Flex'); textSize(22);
      text(arch.name, 100, 200);

      let y = 240;
      for (const k in WYT.SCALES) {
        const s = WYT.SCALES[k], val = v[k];
        stroke('#cfc6b0'); strokeWeight(1); line(100, y + 18, width - 100, y + 18);
        noStroke(); fill(INK); textFont('Space Mono'); textSize(15);
        text(s.subject, 100, y);
        text(val >= 0.5 ? s.high : s.low, 380, y);
        fill(RED); textFont('Caveat'); textSize(34);
        text(WYT.grade(val), width - 160, y - 2);
        y += 40;
      }
      push();
      translate(100, 455); rotate(-0.015);
      fill(RED); noStroke(); textFont('Caveat'); textSize(24); textAlign(LEFT, TOP);
      text(comment, 0, 0, width - 200, 110);
      pop();
    },
  };
}
