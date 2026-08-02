import {
  getAsciiAtmosphereConfig,
  type GlyphBand,
  type TrailSettings,
} from './asciiAtmosphereConfig'

export type FluidSettings = TrailSettings
export type TrailSegment = {
  startX: number
  startY: number
  endX: number
  endY: number
  burst: number
  coasting?: boolean
  inertia?: number
}

export type Fluid = {
  cellSize: number
  columns: number
  rows: number
  density: Float32Array
  nextDensity: Float32Array
  velocityX: Float32Array
  velocityY: Float32Array
  nextVelocityX: Float32Array
  nextVelocityY: Float32Array
  paddle: Float32Array
}

export function createFluid(width: number, height: number): Fluid {
  const cellSize = getAsciiAtmosphereConfig().grid.cellSize
  const columns = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const fieldSize = columns * rows

  return {
    cellSize,
    columns,
    rows,
    density: new Float32Array(fieldSize),
    nextDensity: new Float32Array(fieldSize),
    velocityX: new Float32Array(fieldSize),
    velocityY: new Float32Array(fieldSize),
    nextVelocityX: new Float32Array(fieldSize),
    nextVelocityY: new Float32Array(fieldSize),
    paddle: new Float32Array(fieldSize),
  }
}

export function glyphForDensity(value: number): GlyphBand | null {
  return (
    getAsciiAtmosphereConfig().glyphBands.find(
      (band) => value > band.minimumDensity,
    ) ?? null
  )
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

function index(fluid: Fluid, x: number, y: number) {
  return y * fluid.columns + x
}

// Bilinear sampling smooths movement between fixed glyph cells instead of snapping to neighbors.
function sample(fluid: Fluid, field: Float32Array, x: number, y: number) {
  const sourceX = clamp(x, 0, fluid.columns - 1.001)
  const sourceY = clamp(y, 0, fluid.rows - 1.001)
  const left = Math.floor(sourceX)
  const top = Math.floor(sourceY)
  const mixX = sourceX - left
  const mixY = sourceY - top
  const right = Math.min(fluid.columns - 1, left + 1)
  const bottom = Math.min(fluid.rows - 1, top + 1)

  return (
    field[index(fluid, left, top)] * (1 - mixX) * (1 - mixY) +
    field[index(fluid, right, top)] * mixX * (1 - mixY) +
    field[index(fluid, left, bottom)] * (1 - mixX) * mixY +
    field[index(fluid, right, bottom)] * mixX * mixY
  )
}

function advanceFluid(
  fluid: Fluid,
  settings: FluidSettings,
  frame: number,
  noise: (x: number, y: number, z: number) => number,
) {
  const config = getAsciiAtmosphereConfig().fluid
  for (let y = 0; y < fluid.rows; y += 1)
    for (let x = 0; x < fluid.columns; x += 1) {
      const i = index(fluid, x, y)
      const time = frame * settings.motion * config.noiseTimeScale
      const noiseLeft = noise(
        (x - 1) * config.noiseScale,
        y * config.noiseScale,
        time,
      )
      const noiseRight = noise(
        (x + 1) * config.noiseScale,
        y * config.noiseScale,
        time,
      )
      const noiseTop = noise(
        x * config.noiseScale,
        (y - 1) * config.noiseScale,
        time,
      )
      const noiseBottom = noise(
        x * config.noiseScale,
        (y + 1) * config.noiseScale,
        time,
      )
      const curlX = (noiseBottom - noiseTop) * config.curlStrength
      const curlY = (noiseLeft - noiseRight) * config.curlStrength
      const sourceX = x - fluid.velocityX[i]
      const sourceY = y - fluid.velocityY[i]
      const pressureX =
        fluid.density[index(fluid, Math.max(0, x - 1), y)] -
        fluid.density[index(fluid, Math.min(fluid.columns - 1, x + 1), y)]
      const pressureY =
        fluid.density[index(fluid, x, Math.max(0, y - 1))] -
        fluid.density[index(fluid, x, Math.min(fluid.rows - 1, y + 1))]
      const carriedVelocityX =
        sample(fluid, fluid.velocityX, sourceX, sourceY) +
        curlX +
        pressureX * config.pressureStrength +
        pressureY * config.edgeRollStrength
      const carriedVelocityY =
        sample(fluid, fluid.velocityY, sourceX, sourceY) +
        curlY +
        pressureY * config.pressureStrength -
        pressureX * config.edgeRollStrength

      fluid.nextVelocityX[i] = clamp(
        carriedVelocityX * config.velocityDamping,
        -config.maximumVelocity,
        config.maximumVelocity,
      )
      fluid.nextVelocityY[i] = clamp(
        carriedVelocityY * config.velocityDamping,
        -config.maximumVelocity,
        config.maximumVelocity,
      )

      const carried = sample(fluid, fluid.density, sourceX, sourceY)
      const neighbors =
        (fluid.density[index(fluid, Math.max(0, x - 1), y)] +
          fluid.density[index(fluid, Math.min(fluid.columns - 1, x + 1), y)] +
          fluid.density[index(fluid, x, Math.max(0, y - 1))] +
          fluid.density[index(fluid, x, Math.min(fluid.rows - 1, y + 1))]) /
        4
      const spread =
        config.baseSpread +
        Math.min(config.maximumSpread, carried * config.densitySpread)
      const edgeFade =
        carried < config.wispyDensityThreshold ? config.wispyEdgeFade : 0
      fluid.nextDensity[i] =
        (carried * (1 - spread) + neighbors * spread) *
        (config.baseFade +
          Math.min(
            config.lifetimeFadeRange,
            settings.lifetime / config.lifetimeFadeDivisor,
          ) -
          edgeFade)
    }
}

function injectTrail(
  fluid: Fluid,
  settings: FluidSettings,
  trail: TrailSegment,
) {
  const config = getAsciiAtmosphereConfig().fluid
  const startX = trail.startX / fluid.cellSize
  const startY = trail.startY / fluid.cellSize
  const rawEndX = trail.endX / fluid.cellSize
  const rawEndY = trail.endY / fluid.cellSize
  const movementX = rawEndX - startX
  const movementY = rawEndY - startY
  const movementLength = Math.hypot(movementX, movementY)

  if (movementLength <= config.minimumMovement && trail.burst <= 0) return

  const brush = (settings.size / fluid.cellSize) * config.brushScale
  const endX =
    rawEndX -
    (movementLength
      ? (movementX / movementLength) * brush * config.trailOffset
      : 0)
  const endY =
    rawEndY -
    (movementLength
      ? (movementY / movementLength) * brush * config.trailOffset
      : 0)
  const deltaX = endX - startX
  const deltaY = endY - startY
  const segmentLength = deltaX * deltaX + deltaY * deltaY
  const minX = Math.max(0, Math.floor(Math.min(startX, endX) - brush * 2))
  const maxX = Math.min(
    fluid.columns,
    Math.ceil(Math.max(startX, endX) + brush * 2),
  )
  const minY = Math.max(0, Math.floor(Math.min(startY, endY) - brush * 2))
  const maxY = Math.min(
    fluid.rows,
    Math.ceil(Math.max(startY, endY) + brush * 2),
  )

  for (let y = minY; y < maxY; y += 1)
    for (let x = minX; x < maxX; x += 1) {
      const projection =
        segmentLength === 0
          ? 0
          : clamp(
              ((x - startX) * deltaX + (y - startY) * deltaY) / segmentLength,
              0,
              1,
            )
      const closestX = startX + projection * deltaX
      const closestY = startY + projection * deltaY
      const distance = Math.hypot(x - closestX, y - closestY)
      const weight = Math.exp(-(distance * distance) / (brush * brush))
      const i = index(fluid, x, y)
      const existingDensity = fluid.nextDensity[i]

      if (movementLength > config.minimumMovement) {
        const directionX = movementX / movementLength
        const directionY = movementY / movementLength
        const normalX = -directionY
        const normalY = directionX
        const side =
          ((x - closestX) * -directionY + (y - closestY) * directionX) /
          Math.max(brush, 0.01)
        const speed =
          Math.min(
            config.maximumSpeed,
            config.speedBase + movementLength * config.speedMultiplier,
          ) * (trail.coasting ? (trail.inertia ?? 0) * config.coastMomentum : 1)
        const wake = weight * speed
        const displacedDensity =
          1 + Math.min(1, fluid.density[i]) * config.densityDisplacementStrength
        fluid.nextVelocityX[i] +=
          (directionX * config.forwardWakeStrength +
            -directionY * side * config.sidewaysWakeStrength) *
          wake *
          displacedDensity
        fluid.nextVelocityY[i] +=
          (directionY * config.forwardWakeStrength +
            directionX * side * config.sidewaysWakeStrength) *
          wake *
          displacedDensity

        // Move existing density to either side of the stroke. Using a separate buffer keeps
        // this transfer mass-preserving and prevents it from cascading through the loop.
        if (!trail.coasting) {
          const collision = Math.min(
            1,
            existingDensity * weight * config.partingStrength,
          )
          const partedDensity = existingDensity * collision
          const offset = Math.max(1, Math.round(brush * config.partingDistance))
          const cutSpeed = Math.min(
            config.maximumCutSpeed,
            movementLength * config.cutSpeedMultiplier,
          )
          const cutImpulse = collision * cutSpeed * config.cutImpulseStrength
          const leftX = Math.round(
            clamp(x - normalX * offset, 0, fluid.columns - 1),
          )
          const leftY = Math.round(
            clamp(y - normalY * offset, 0, fluid.rows - 1),
          )
          const rightX = Math.round(
            clamp(x + normalX * offset, 0, fluid.columns - 1),
          )
          const rightY = Math.round(
            clamp(y + normalY * offset, 0, fluid.rows - 1),
          )
          fluid.paddle[i] -= partedDensity
          if (Math.abs(side) < 0.1) {
            const left = index(fluid, leftX, leftY)
            const right = index(fluid, rightX, rightY)
            fluid.paddle[left] += partedDensity / 2
            fluid.paddle[right] += partedDensity / 2
            fluid.nextVelocityX[left] -= normalX * cutImpulse
            fluid.nextVelocityY[left] -= normalY * cutImpulse
            fluid.nextVelocityX[right] += normalX * cutImpulse
            fluid.nextVelocityY[right] += normalY * cutImpulse
          } else if (side < 0) {
            const left = index(fluid, leftX, leftY)
            fluid.paddle[left] += partedDensity
            fluid.nextVelocityX[left] -= normalX * cutImpulse
            fluid.nextVelocityY[left] -= normalY * cutImpulse
          } else {
            const right = index(fluid, rightX, rightY)
            fluid.paddle[right] += partedDensity
            fluid.nextVelocityX[right] += normalX * cutImpulse
            fluid.nextVelocityY[right] += normalY * cutImpulse
          }
        }
      }

      const injectedDensity = trail.coasting
        ? 0
        : weight *
          (trail.burst
            ? config.burstDensityInjection
            : settings.density / config.movementDensityInjectionDivisor)
      const collisionResistance =
        movementLength > config.minimumMovement
          ? Math.min(0.9, existingDensity * weight * config.partingStrength)
          : 0
      fluid.nextDensity[i] = Math.min(
        config.maximumDensity,
        fluid.nextDensity[i] + injectedDensity * (1 - collisionResistance),
      )
    }
}

export function stepFluid(
  fluid: Fluid,
  settings: FluidSettings,
  frame: number,
  noise: (x: number, y: number, z: number) => number,
  trail?: TrailSegment,
) {
  // First carry existing smoke forward, then let the pointer add density and momentum to that frame.
  advanceFluid(fluid, settings, frame, noise)
  fluid.paddle.fill(0)
  if (trail) injectTrail(fluid, settings, trail)
  const maximumVelocity = getAsciiAtmosphereConfig().fluid.maximumVelocity
  for (let i = 0; i < fluid.nextDensity.length; i += 1) {
    fluid.nextDensity[i] = Math.max(0, fluid.nextDensity[i] + fluid.paddle[i])
    fluid.nextVelocityX[i] = clamp(
      fluid.nextVelocityX[i],
      -maximumVelocity,
      maximumVelocity,
    )
    fluid.nextVelocityY[i] = clamp(
      fluid.nextVelocityY[i],
      -maximumVelocity,
      maximumVelocity,
    )
  }

  ;[fluid.density, fluid.nextDensity] = [fluid.nextDensity, fluid.density]
  ;[fluid.velocityX, fluid.nextVelocityX] = [
    fluid.nextVelocityX,
    fluid.velocityX,
  ]
  ;[fluid.velocityY, fluid.nextVelocityY] = [
    fluid.nextVelocityY,
    fluid.velocityY,
  ]
}
