// Corrected time. The device clock is adjusted by an offset measured against
// an HTTP time service (5 requests, the one with the shortest round trip wins).
// If the service cannot be reached, the device clock is used as is.
const SOURCE = "https://time.akamai.com/?ms";
export const clock = { offset: 0, rtt: null };

export const now = () => Date.now() + clock.offset;

async function sync() {
  let best = Infinity;
  for (let i = 0; i < 5; i++) {
    try {
      const t0 = Date.now();
      const server = parseFloat(await (await fetch(SOURCE, { cache: "no-store" })).text()) * 1000;
      const t1 = Date.now();
      if (t1 - t0 < best) {
        best = t1 - t0;
        Object.assign(clock, { offset: server - (t0 + t1) / 2, rtt: best });
      }
    } catch {}
  }
}

export function start() {
  sync();
  setInterval(sync, 10 * 60 * 1000);
}
