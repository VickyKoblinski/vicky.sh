/*
 * AsciiAtmosphere
 *
 * The imperative p5 canvas behind the hero's interactive ASCII trail. Parents
 * provide the latest settings and send pointer coordinates through its ref; the
 * fluid math itself belongs in asciiFluid rather than this React wrapper.
 */
import p5 from 'p5'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import {
  getAsciiAtmosphereConfig,
  initialTrailSettings,
  setAsciiAtmosphereConfig,
  type AsciiAtmosphereConfig,
} from './asciiAtmosphereConfig'
import {
  createFluid,
  glyphForDensity,
  stepFluid,
  type FluidSettings,
} from './asciiFluid'

export type AsciiAtmosphereHandle = {
  burst: (x: number, y: number) => void
  move: (x: number, y: number) => void
}

type PointerState = {
  x: number
  y: number
  previousX: number
  previousY: number
  lastStartX: number
  lastStartY: number
  lastEndX: number
  lastEndY: number
  inertia: number
  burst: number
  primed: boolean
  pending: boolean
}

const AsciiAtmosphere = forwardRef<
  AsciiAtmosphereHandle,
  { settings: FluidSettings; config: AsciiAtmosphereConfig }
>(function AsciiAtmosphere({ settings, config }, ref) {
  const hostRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<PointerState>({
    x: -500,
    y: -500,
    previousX: -500,
    previousY: -500,
    lastStartX: -500,
    lastStartY: -500,
    lastEndX: -500,
    lastEndY: -500,
    inertia: 0,
    burst: 0,
    primed: false,
    pending: false,
  })
  const settingsRef = useRef(settings)
  const configRef = useRef(config)

  // p5 is created once; this ref supplies fresh slider values each frame.
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])
  configRef.current = config

  useImperativeHandle(ref, () => ({
    move(x, y) {
      const pointer = pointerRef.current
      const firstMovement = !pointer.primed
      const previousX = pointer.x < 0 ? x : pointer.x
      const previousY = pointer.y < 0 ? y : pointer.y
      pointer.previousX = previousX
      pointer.previousY = previousY
      pointer.lastStartX = previousX
      pointer.lastStartY = previousY
      pointer.lastEndX = x
      pointer.lastEndY = y
      const movementDistance = Math.hypot(x - previousX, y - previousY)
      if (movementDistance > 0) {
        const fluid = getAsciiAtmosphereConfig().fluid
        pointer.inertia = Math.min(
          fluid.maximumCoastInertia,
          movementDistance / fluid.coastSpeedDivisor,
        )
      }
      pointer.x = x
      pointer.y = y
      // A click made the field feel more alive, so the first genuine cursor entry gets
      // the same single-frame bloom. Subsequent stationary pointer events still inject nothing.
      if (firstMovement)
        pointer.burst = getAsciiAtmosphereConfig().fluid.firstMovementBurst
      pointer.primed = true
      pointer.pending = true
    },
    burst(x, y) {
      pointerRef.current = {
        x,
        y,
        previousX: x,
        previousY: y,
        lastStartX: x,
        lastStartY: y,
        lastEndX: x,
        lastEndY: y,
        inertia: 0,
        burst: 1,
        primed: true,
        pending: true,
      }
    },
  }))

  useEffect(() => {
    const host = hostRef.current
    // Canvas-dependent p5 code is intentionally skipped in JSDOM component tests.
    if (!host || navigator.userAgent.includes('jsdom')) return

    const sketch = new p5((scene) => {
      let fluid = createFluid(0, 0)

      scene.setup = () => {
        setAsciiAtmosphereConfig(configRef.current)
        const canvas = scene.createCanvas(host.clientWidth, host.clientHeight)
        canvas.elt.setAttribute('aria-hidden', 'true')
        const config = getAsciiAtmosphereConfig()
        scene.pixelDensity(
          Math.min(devicePixelRatio, config.grid.maxPixelDensity),
        )
        scene.colorMode(
          scene.HSB,
          config.color.hueMaximum,
          config.color.saturationMaximum,
          config.color.brightnessMaximum,
          config.color.alphaMaximum,
        )
        scene.textAlign(scene.CENTER, scene.CENTER)
        scene.textFont(config.grid.font)
        fluid = createFluid(scene.width, scene.height)
      }

      scene.windowResized = () => {
        scene.resizeCanvas(host.clientWidth, host.clientHeight)
        fluid = createFluid(scene.width, scene.height)
      }

      scene.draw = () => {
        // The canvas receives React's current config directly; opening a native details
        // element cannot change which configuration the simulation is using.
        setAsciiAtmosphereConfig(configRef.current)
        const config = getAsciiAtmosphereConfig()
        if (fluid.cellSize !== config.grid.cellSize)
          fluid = createFluid(scene.width, scene.height)
        scene.colorMode(
          scene.HSB,
          config.color.hueMaximum,
          config.color.saturationMaximum,
          config.color.brightnessMaximum,
          config.color.alphaMaximum,
        )
        scene.textFont(config.grid.font)
        const pointer = pointerRef.current
        const hadFreshMovement = pointer.pending
        const trail = pointer.pending
          ? {
              startX: pointer.previousX,
              startY: pointer.previousY,
              endX: pointer.x,
              endY: pointer.y,
              burst: pointer.burst,
            }
          : pointer.inertia > config.fluid.coastThreshold
            ? {
                startX: pointer.lastStartX,
                startY: pointer.lastStartY,
                endX: pointer.lastEndX,
                endY: pointer.lastEndY,
                burst: 0,
                coasting: true,
                inertia: pointer.inertia,
              }
            : undefined

        stepFluid(
          fluid,
          settingsRef.current,
          scene.frameCount,
          (x, y, z) => scene.noise(x, y, z),
          trail,
        )

        if (pointer.pending) {
          pointer.previousX = pointer.x
          pointer.previousY = pointer.y
          pointer.pending = false
        }
        if (!hadFreshMovement) pointer.inertia *= config.fluid.coastDecay
        pointer.burst *= config.fluid.burstDecay

        scene.clear()
        for (let y = 0; y < fluid.rows; y += 1)
          for (let x = 0; x < fluid.columns; x += 1) {
            const glyph = glyphForDensity(fluid.density[y * fluid.columns + x])
            if (!glyph) continue

            scene.fill(
              config.color.hue,
              config.color.saturation,
              config.color.brightness,
              glyph.shade *
                (settingsRef.current.opacity / initialTrailSettings.opacity),
            )
            scene.textSize(glyph.fontSize)
            scene.text(
              glyph.glyph,
              x * fluid.cellSize + fluid.cellSize / 2,
              y * fluid.cellSize + fluid.cellSize / 2,
            )
          }
      }
    }, host)

    return () => sketch.remove()
  }, [])

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 size-full"
      role="img"
      aria-label="Interactive ASCII atmosphere"
    />
  )
})

export default AsciiAtmosphere
