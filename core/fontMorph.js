// Maps the 5 scales onto variable-font axes (Roboto Flex: wght, wdth, slnt)
// and animates a DOM element toward them. Canvas text can't do variable axes
// reliably, so the morphing type always lives in the DOM.
window.WYT = window.WYT || {};

(function () {
  const L = (a, b, t) => a + (b - a) * t;

  WYT.axesFor = function (v) {
    return {
      wght: Math.round(L(200, 950, 0.7 * v.boldness + 0.3 * v.density)),
      wdth: Math.round(L(65, 145, 0.5 * v.density + 0.5 * v.play)),
      slnt: Math.round(L(0, -10, 0.6 * v.play + 0.4 * (1 - v.order))),
    };
  };

  WYT.axesCSS = function (a) {
    return `"wght" ${Math.round(a.wght)}, "wdth" ${Math.round(a.wdth)}, "slnt" ${Math.round(a.slnt)}`;
  };

  WYT.FontMorph = class {
    constructor(el) {
      this.el = el;
      const neutral = WYT.axesFor({ order: .5, density: .5, boldness: .5, play: .5, precision: .5 });
      this.cur = { ...neutral };
      this.target = { ...neutral };
      const tick = () => {
        for (const k in this.cur) this.cur[k] += (this.target[k] - this.cur[k]) * 0.06;
        if (this.el) this.el.style.fontVariationSettings = WYT.axesCSS(this.cur);
        requestAnimationFrame(tick);
      };
      tick();
    }
    setTarget(profile) {
      this.target = WYT.axesFor(WYT.snapshot(profile));
    }
  };

  // "Your name in your font": an input + live specimen inside a container.
  WYT.nameSpecimen = function (container, axes, placeholder = 'your name') {
    container.innerHTML = '';
    const out = document.createElement('div');
    out.className = 'specimen';
    out.style.fontVariationSettings = WYT.axesCSS(axes);
    out.textContent = placeholder;
    const input = document.createElement('input');
    input.placeholder = 'type your name';
    input.maxLength = 18;
    input.addEventListener('input', () => { out.textContent = input.value || placeholder; });
    container.append(out, input);
    container.hidden = false;
  };
})();
