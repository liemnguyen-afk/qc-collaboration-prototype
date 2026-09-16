# Report page sources

The two attachment previews in the Attachments Library are page images of lab reports. These are the
HTML sources they were rendered from, so the numbers can be edited and the images regenerated.

| Source | Rendered to | Previews |
| --- | --- | --- |
| `sound-level-report-c5.html` | `assets/img/sound-level-report-c5.png` | `Sound-level-J1169-C5.pdf` |
| `cmm-dimensional-report-c3.html` | `assets/img/cmm-dimensional-report-c3.png` | `CMM-dimensional-C3.pdf` |

Each file sets an explicit `body { width; height }` — that is the capture area, so the window size
below must match it, and the height should be trimmed to the content or the preview will show a band
of blank paper.

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=636,686 \
  --screenshot=assets/img/sound-level-report-c5.png \
  "file://$PWD/tools/reports/sound-level-report-c5.html"

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=636,658 \
  --screenshot=assets/img/cmm-dimensional-report-c3.png \
  "file://$PWD/tools/reports/cmm-dimensional-report-c3.html"
```

`--force-device-scale-factor=2` is what keeps the small type legible: the preview pane renders the
image at about 520 px wide, so a 636 px page is captured at 1272 px and downscaled.

The values in these reports are consistent with [`assets/js/data.js`](../../assets/js/data.js) — the
sound report's lot maximum of 97.1 dB(A) is the 97 dB(A) result on characteristic 5, and the CMM
report's 357.4 mm is the result on characteristic 3, with its revision note matching the *Revised
Result* history entry. Change one and change the other.
