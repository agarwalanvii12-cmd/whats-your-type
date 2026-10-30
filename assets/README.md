# Assets

Hand-drawn illustrations go here. Scan or export as transparent PNG (or SVG), around 2x the size they appear on screen.

Suggested names, matching the grey-box labels in the prototypes:

```
characters/ruler.png
characters/scissors.png
characters/tape.png
characters/compass.png
characters/eraser.png
characters/highlighter.png
pencil-case-closed.png
pencil-case-open.png
doodles/doodle-01.png ...
zine/cutout-photo.png, cutout-star.png, cutout-paper-clip.png ...
```

To swap one in: load it in `preload()`/`setup()` with `loadImage('../assets/...')`, then replace the
matching `WYT.ui.greyBox('label', x, y, w, h)` call with `image(img, x, y, w, h)`.
