export type TrailSettings = {
  opacity: number
  size: number
  density: number
  lifetime: number
  motion: number
}

export type GlyphBand = {
  minimumDensity: number
  glyph: string
  shade: number
  fontSize: number
}
type NumericSettings = Record<string, number>
type NumericControl = { min: number; max: number; step: number }
export type AsciiAtmosphereConfig = {
  grid: { cellSize: number; maxPixelDensity: number; font: string }
  color: NumericSettings
  fluid: NumericSettings
  glyphBands: GlyphBand[]
  trailControls: {
    key: keyof TrailSettings
    label: string
    min: number
    max: number
    initial: number
  }[]
}

// Paste the object copied from the Simulation Lab here to make it the site's default.
// Its shape intentionally matches the Copy JSON output exactly.
export const defaultAtmospherePreset: {
  trailSettings: TrailSettings
  atmosphereConfig: AsciiAtmosphereConfig
} = {
  trailSettings: {
    opacity: 86,
    size: 8,
    density: 32,
    lifetime: 260,
    motion: 12,
  },
  atmosphereConfig: {
    grid: {
      cellSize: 10,
      maxPixelDensity: 2,
      font: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    color: {
      hueMaximum: 360,
      saturationMaximum: 100,
      brightnessMaximum: 100,
      hue: 255,
      saturation: 62,
      brightness: 68,
      alphaMaximum: 255,
    },
    fluid: {
      noiseScale: 0.06,
      noiseTimeScale: 0.002,
      curlStrength: 0.4,
      pressureStrength: 0.14,
      edgeRollStrength: 0.14,
      velocityDamping: 0.91,
      burstDecay: 0.9,
      maximumVelocity: 2.8,
      baseSpread: 0.035,
      densitySpread: 0.075,
      maximumSpread: 0.045,
      baseFade: 0.968,
      lifetimeFadeRange: 0.024,
      lifetimeFadeDivisor: 10000,
      wispyDensityThreshold: 0.55,
      wispyEdgeFade: 0.01,
      brushScale: 1.35,
      trailOffset: 0.85,
      maximumDensity: 1.65,
      movementDensityInjectionDivisor: 102,
      burstDensityInjection: 0.88,
      minimumMovement: 0.05,
      speedBase: 0.38,
      speedMultiplier: 0.2,
      maximumSpeed: 1.8,
      forwardWakeStrength: 1.32,
      sidewaysWakeStrength: 0.96,
      densityDisplacementStrength: 0.85,
      partingStrength: 0.55,
      partingDistance: 0.8,
      cutImpulseStrength: 1.5,
      cutSpeedMultiplier: 0.45,
      maximumCutSpeed: 3,
      firstMovementBurst: 0.88,
      coastMomentum: 1,
      coastDecay: 0.76,
      coastThreshold: 0.06,
      coastSpeedDivisor: 6,
      maximumCoastInertia: 2,
    },
    glyphBands: [
      { minimumDensity: 0.84, glyph: 'o', shade: 156, fontSize: 12 },
      { minimumDensity: 0.66, glyph: '>', shade: 105, fontSize: 12 },
      { minimumDensity: 0.61, glyph: '—', shade: 55, fontSize: 11 },
    ],
    trailControls: [
      { key: 'opacity', label: 'Core opacity', min: 40, max: 100, initial: 86 },
      { key: 'size', label: 'Brush size', min: 8, max: 36, initial: 17 },
      { key: 'density', label: 'Trail density', min: 8, max: 60, initial: 32 },
      {
        key: 'lifetime',
        label: 'Trail lifetime',
        min: 40,
        max: 260,
        initial: 155,
      },
      { key: 'motion', label: 'Motion', min: 3, max: 24, initial: 12 },
    ],
  },
}

export const asciiAtmosphereConfig = defaultAtmospherePreset.atmosphereConfig
export const initialTrailSettings = defaultAtmospherePreset.trailSettings

// These are intentionally hand-tuned. In particular, cell size and pixel density have
// conservative caps because they directly determine how much work happens each frame.
export const simulationControlRanges: Record<
  'grid' | 'color' | 'fluid',
  Record<string, NumericControl>
> = {
  grid: {
    cellSize: { min: 6, max: 24, step: 1 },
    maxPixelDensity: { min: 1, max: 2, step: 1 },
  },
  color: {
    hueMaximum: { min: 180, max: 720, step: 10 },
    saturationMaximum: { min: 50, max: 200, step: 5 },
    brightnessMaximum: { min: 50, max: 200, step: 5 },
    alphaMaximum: { min: 100, max: 255, step: 5 },
    hue: { min: 0, max: 360, step: 1 },
    saturation: { min: 0, max: 100, step: 1 },
    brightness: { min: 0, max: 100, step: 1 },
  },
  fluid: {
    noiseScale: { min: 0.01, max: 0.18, step: 0.005 },
    noiseTimeScale: { min: 0.00005, max: 0.002, step: 0.00005 },
    curlStrength: { min: 0.1, max: 3, step: 0.05 },
    pressureStrength: { min: 0, max: 1, step: 0.01 },
    edgeRollStrength: { min: 0, max: 0.5, step: 0.01 },
    velocityDamping: { min: 0.7, max: 0.99, step: 0.005 },
    burstDecay: { min: 0.7, max: 0.99, step: 0.005 },
    maximumVelocity: { min: 0.5, max: 4, step: 0.1 },
    baseSpread: { min: 0, max: 0.15, step: 0.001 },
    densitySpread: { min: 0, max: 0.2, step: 0.005 },
    maximumSpread: { min: 0.01, max: 0.25, step: 0.005 },
    baseFade: { min: 0.9, max: 0.999, step: 0.001 },
    lifetimeFadeRange: { min: 0, max: 0.08, step: 0.001 },
    lifetimeFadeDivisor: { min: 1000, max: 20000, step: 500 },
    wispyDensityThreshold: { min: 0.1, max: 1.2, step: 0.01 },
    wispyEdgeFade: { min: 0, max: 0.08, step: 0.001 },
    brushScale: { min: 0.5, max: 2, step: 0.05 },
    trailOffset: { min: 0, max: 2, step: 0.05 },
    maximumDensity: { min: 0.5, max: 3, step: 0.05 },
    movementDensityInjectionDivisor: { min: 20, max: 200, step: 1 },
    burstDensityInjection: { min: 0.05, max: 1.5, step: 0.05 },
    minimumMovement: { min: 0.001, max: 0.2, step: 0.001 },
    speedBase: { min: 0, max: 1.5, step: 0.05 },
    speedMultiplier: { min: 0, max: 0.8, step: 0.05 },
    maximumSpeed: { min: 0.3, max: 3, step: 0.1 },
    forwardWakeStrength: { min: 0, max: 2.5, step: 0.05 },
    sidewaysWakeStrength: { min: 0, max: 2.5, step: 0.05 },
    densityDisplacementStrength: { min: 0, max: 2, step: 0.05 },
    partingStrength: { min: 0, max: 1, step: 0.05 },
    partingDistance: { min: 0.25, max: 2, step: 0.05 },
    cutImpulseStrength: { min: 0, max: 3, step: 0.05 },
    cutSpeedMultiplier: { min: 0.05, max: 1, step: 0.05 },
    maximumCutSpeed: { min: 0.5, max: 5, step: 0.1 },
    firstMovementBurst: { min: 0, max: 1.5, step: 0.05 },
    coastMomentum: { min: 0, max: 3, step: 0.05 },
    coastDecay: { min: 0.4, max: 0.9, step: 0.01 },
    coastThreshold: { min: 0.01, max: 0.2, step: 0.01 },
    coastSpeedDivisor: { min: 2, max: 20, step: 1 },
    maximumCoastInertia: { min: 0.5, max: 3, step: 0.1 },
  },
}

// The creative lab exposes only controls with a clear visual effect. The remaining
// values stay here for deliberate code-level tuning without overwhelming the UI.
export const fluidLabControls = [
  {
    key: 'curlStrength',
    label: 'Curl',
    description: 'How much the trail rolls and twists.',
  },
  {
    key: 'noiseTimeScale',
    label: 'Flow speed',
    description: 'How quickly the ambient current changes.',
  },
  {
    key: 'pressureStrength',
    label: 'Push',
    description: 'How strongly dense areas spread outward.',
  },
  {
    key: 'baseSpread',
    label: 'Spread rate',
    description:
      'How quickly the faint trail diffuses outward. Set near zero for tighter flow.',
  },
  {
    key: 'maximumSpread',
    label: 'Spread cap',
    description: 'The maximum amount the trail can soften at the edges.',
  },
  {
    key: 'wispyEdgeFade',
    label: 'Edge fade',
    description: 'How quickly the faint outer wisps disappear.',
  },
  {
    key: 'forwardWakeStrength',
    label: 'Drag',
    description: 'How much your motion pulls the trail along.',
  },
  {
    key: 'sidewaysWakeStrength',
    label: 'Side wake',
    description: 'How much a stroke curls and pushes sideways.',
  },
  {
    key: 'partingStrength',
    label: 'Parting',
    description:
      'How strongly a new stroke splits an existing trail into two sides.',
  },
  {
    key: 'partingDistance',
    label: 'Part width',
    description: 'How far to each side the displaced trail is moved.',
  },
  {
    key: 'cutImpulseStrength',
    label: 'Collision force',
    description:
      'How strongly a fast stroke kicks an existing trail out of its path.',
  },
  {
    key: 'coastMomentum',
    label: 'Inertia',
    description: 'How much a trail keeps flowing after the cursor stops.',
  },
] as const

export function controlRangeFor(
  section: 'grid' | 'color' | 'fluid',
  key: string,
): NumericControl {
  return simulationControlRanges[section][key] ?? { min: 0, max: 1, step: 0.01 }
}

let activeConfig = asciiAtmosphereConfig

export function createAsciiAtmosphereConfig() {
  return JSON.parse(
    JSON.stringify(asciiAtmosphereConfig),
  ) as AsciiAtmosphereConfig
}

export function getAsciiAtmosphereConfig() {
  return activeConfig
}

export function setAsciiAtmosphereConfig(config: AsciiAtmosphereConfig) {
  activeConfig = config
}
