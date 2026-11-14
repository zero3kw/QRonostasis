# QRonostasis

A clock that shows the time as a QR code, so every frame of a stream or a
recording carries a machine-readable timestamp.

Live: https://zero3kw.github.io/QR/

- `docs/clock.html`: the clock for an OBS browser source. The QR code holds
  `HTTPS://ZERO3KW.GITHUB.IO/QR/<Unix seconds>` and switches on the second; it
  fills the source on a transparent background. The URL is in capitals so the
  prefix fits the QR alphanumeric mode and the seconds the numeric mode, which
  keeps the code at 25x25 modules. It reads at 44px and up under 1 Mbps
  x264 in tests; 60px is recommended. Dots with rounded finder patterns.
  Colors: `clock.html?fg=RRGGBB&bg=RRGGBB` (hex without `#`), black on white
  by default.
- `docs/index.html`: how to use it, with a live preview and color pickers
  that build the URL and warn about low contrast or light-on-dark colors.
- `docs/404.html`: GitHub Pages serves it for unknown paths; for
  `/QR/<10 digits>` it shows that moment in local time, UTC and Unix seconds.
- `docs/time.js`: corrects the device clock against
  `https://time.akamai.com/?ms` (5 requests, shortest round trip), every
  10 minutes. Falls back to the device clock.

Plain HTML and JavaScript served by GitHub Pages from `docs/`; no build step.
To view it locally:

```
python3 -m http.server 8000 -d docs
```

The iPhone app that reads the timestamps is in
[QRonostasis-Apple](https://github.com/zero3kw/QRonostasis-Apple).

`docs/qrcode.min.js` is [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)
1.4.4 by Kazuhiko Arase (MIT License).
