export function createSeededRandom(seed: string | number = 1) {
  let state = normalizeSeed(seed);

  return function seededRandom() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function normalizeSeed(seed: string | number) {
  if (typeof seed === "number") {
    return seed >>> 0 || 1;
  }

  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0 || 1;
}
