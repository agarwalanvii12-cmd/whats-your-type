// Shared drawing helpers (p5 global mode). Placeholder look only:
// real characters and doodles come from /assets.
window.WYT = window.WYT || {};

(function () {
  const buttons = {};

  const ui = {
    INK: '#1d1d1b',
    PAPER: '#fbf8f1',
    RED: '#e0321f',

    beginFrame() { for (const k in buttons) delete buttons[k]; },

    over(x, y, w, h) { return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h; },

    hit(name) {
      const b = buttons[name];
      return !!b && ui.over(b.x, b.y, b.w, b.h);
    },

    button(name, label, x, y, w, h, opts = {}) {
      buttons[name] = { x, y, w, h };
      const hov = ui.hit(name);
      const o = hov ? 2 : 0;
      push();
      noStroke(); fill(ui.INK); rect(x + 4, y + 4, w, h);
      stroke(ui.INK); strokeWeight(2);
      fill(opts.selected ? '#ffe14d' : hov ? (opts.hover || '#ffe14d') : (opts.fill || '#fff'));
      rect(x + o, y + o, w, h);
      noStroke(); fill(ui.INK);
      textFont(opts.font || 'Space Mono'); textSize(opts.size || 16);
      textAlign(CENTER, CENTER);
      text(label, x + w / 2 + o, y + h / 2 + o);
      pop();
    },

    // Stand-in for a hand-drawn asset. Swap for image(...) once the drawing exists.
    greyBox(label, x, y, w, h) {
      push();
      fill(225); stroke(150); strokeWeight(1.5);
      drawingContext.setLineDash([6, 5]);
      rect(x, y, w, h);
      drawingContext.setLineDash([]);
      noStroke(); fill(110);
      textFont('Space Mono'); textSize(11);
      textAlign(CENTER, CENTER);
      text('[' + label + ']', x + 4, y + 4, w - 8, h - 8);
      pop();
    },

    bubble(txt, x, y, w, font = 'Space Mono', size = 17) {
      push();
      textFont(font); textSize(size); textLeading(size * 1.3);
      const lines = Math.max(1, Math.ceil(textWidth(txt) / (w - 36)));
      const h = lines * size * 1.3 + 26;
      stroke(ui.INK); strokeWeight(2); fill(255);
      triangle(x, y + h * 0.55, x + 1, y + h * 0.3, x - 18, y + h * 0.5);
      rect(x, y, w, h, 14);
      noStroke(); triangle(x + 2, y + h * 0.55, x + 2, y + h * 0.3, x - 15, y + h * 0.5);
      fill(ui.INK); textAlign(LEFT, TOP);
      text(txt, x + 18, y + 13, w - 36, h);
      pop();
      return h;
    },

    // A stationery host: grey-box character + speech bubble in its own font voice.
    host(label, line, font, size) {
      ui.greyBox(label, 30, 26, 110, 110);
      ui.bubble(line, 165, 34, 690, font, size);
    },

    progress(i, n) {
      push();
      for (let k = 0; k < n; k++) {
        stroke(ui.INK); strokeWeight(1.5);
        fill(k <= i ? ui.INK : 255);
        circle(width - 30 - (n - 1 - k) * 18, height - 22 - 60, 10);
      }
      pop();
    },
  };

  WYT.ui = ui;
})();
