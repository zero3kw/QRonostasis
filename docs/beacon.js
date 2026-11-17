// drand quicknet (League of Entropy): an unpredictable random value published
// every 3 seconds. A code carrying part of it cannot have been made before
// that round, so a frame showing it was recorded after the round's time.
// The round follows from the time, so a code carries only 20 digits of the
// value (the first 8 bytes of the randomness in decimal).
import { now } from "./time.js";

const CHAIN = "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971";
const GENESIS = 1692803367, PERIOD = 3;
const HOSTS = ["https://api.drand.sh", "https://drand.cloudflare.com"];

export const roundAt = (sec) => Math.floor((sec - GENESIS) / PERIOD) + 1;
export const roundTime = (round) => GENESIS + (round - 1) * PERIOD;
export const digitsOf = (randomness) => BigInt("0x" + randomness.slice(0, 16)).toString().padStart(20, "0");

/** One round ({round, randomness}), or the latest; null if no host answers. */
export async function fetchRound(round = "latest") {
  for (const host of HOSTS) {
    try {
      const res = await fetch(`${host}/${CHAIN}/public/${round}`, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {}
  }
  return null;
}

/** The latest round known here, kept current by start(). */
export const beacon = { round: 0, digits: "" };

/** The digits to put in a code for second `sec`, or "" if the beacon is stale. */
export const digitsFor = (sec) => (beacon.round && roundAt(sec) - beacon.round <= 1 ? beacon.digits : "");

export async function start() {
  const r = await fetchRound();
  if (r && r.round > beacon.round) Object.assign(beacon, { round: r.round, digits: digitsOf(r.randomness) });
  // Ask again just after the next round is due.
  const next = (roundTime((beacon.round || roundAt(now() / 1000)) + 1) * 1000 - now()) + 200;
  setTimeout(start, Math.min(Math.max(next, 500), 10000));
}

/**
 * The round whose digits a code carries, or null if it is not verified (no
 * match, or drand unreachable). The display may lag a round behind, so the
 * round at `sec` and the one before are tried.
 */
export async function verify(sec, digits) {
  for (const round of [roundAt(sec), roundAt(sec) - 1]) {
    const r = await fetchRound(round);
    if (r && digitsOf(r.randomness) === digits) return round;
  }
  return null;
}
