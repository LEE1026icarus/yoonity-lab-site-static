export type CosmicSceneConfig = {
  particleCount: number;
  positions: number[];
  colors: number[];
};

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCosmicSceneConfig(isNarrow: boolean): CosmicSceneConfig {
  const particleCount = isNarrow ? 1200 : 3000;
  const random = seededRandom(isNarrow ? 1200 : 3000);
  const positions = new Array<number>(particleCount * 3);
  const colors = new Array<number>(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * 24;
    positions[offset + 1] = (random() - 0.5) * 24;
    positions[offset + 2] = (random() - 0.5) * 24;

    const hue = (0.43 + random() * 0.22) % 1;
    const saturation = 0.72 + random() * 0.2;
    const lightness = 0.56 + random() * 0.2;
    colors[offset] = hue;
    colors[offset + 1] = saturation;
    colors[offset + 2] = lightness;
  }

  return { particleCount, positions, colors };
}

export function getCosmicPointerTransform(x: number, y: number) {
  const normalizedX = Math.max(-1, Math.min(1, x));
  const normalizedY = Math.max(-1, Math.min(1, y));
  return {
    rotationX: normalizedY === 0 ? 0 : -normalizedY * 0.18,
    rotationY: normalizedX * 0.18,
    cameraX: normalizedX * 1.8,
    cameraY: normalizedY === 0 ? 0 : -normalizedY * 1.2,
  };
}

export function getCosmicScrollState(progress: number) {
  const value = Math.max(0, Math.min(1, progress));
  return {
    scale: 1 + value * 2,
    rotationZ: value * Math.PI * 2,
    cameraZ: 4 - value * 1.3,
    sculptureX: 0.75 + value * 3.05,
  };
}
