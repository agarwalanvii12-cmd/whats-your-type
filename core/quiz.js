// The quiz state machine shared by every skin:  INTRO -> QUESTION[i] -> RESULT
//
// A question object looks like:
//   { title, enter?(), draw(), pressed?(), dragged?(), released?(),
//     ready() -> bool, commit() -> { move, nudges, ...extra } }
// A result object: { enter(profile), draw(), pressed?() }
window.WYT = window.WYT || {};

WYT.runQuiz = function (cfg) {
  const ui = WYT.ui;
  const profile = WYT.createProfile();
  const qs = cfg.questions;
  let state = 'intro';
  let i = 0;

  function finishQuestion() {
    const q = qs[i];
    const ans = q.commit();
    WYT.record(profile, { question: q.title, move: ans.move, nudges: ans.nudges });
    if (cfg.onAnswer) cfg.onAnswer(profile, ans, q);
    i++;
    if (i >= qs.length) {
      state = 'result';
      cfg.result.enter(profile);
    } else if (qs[i].enter) {
      qs[i].enter();
    }
  }

  return {
    profile,
    get state() { return state; },

    draw() {
      ui.beginFrame();
      if (state === 'intro') {
        cfg.intro.draw();
        ui.button('next', cfg.intro.cta || 'start', width / 2 - 100, height - 120, 200, 52);
      } else if (state === 'question') {
        const q = qs[i];
        q.draw();
        ui.progress(i, qs.length);
        if (q.ready()) {
          ui.button('next', i === qs.length - 1 ? 'finish' : 'next', width - 200, height - 70, 170, 46);
        }
      } else {
        cfg.result.draw();
      }
      if (cfg.overlay) cfg.overlay();
    },

    pressed() {
      if (state === 'intro') {
        if (ui.hit('next')) {
          state = 'question';
          if (qs[0].enter) qs[0].enter();
        }
      } else if (state === 'question') {
        const q = qs[i];
        if (q.ready() && ui.hit('next')) return finishQuestion();
        if (q.pressed) q.pressed();
      } else if (cfg.result.pressed) {
        cfg.result.pressed();
      }
    },

    dragged() { if (state === 'question' && qs[i].dragged) qs[i].dragged(); },
    released() { if (state === 'question' && qs[i].released) qs[i].released(); },
  };
};
