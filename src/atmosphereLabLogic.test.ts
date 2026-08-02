import { describe, expect, it } from 'vitest'
import { asciiAtmosphereConfig, controlRangeFor, fluidLabControls } from './asciiAtmosphereConfig'
import { formatConfigLabel, randomizeFluidConfig } from './atmosphereLabLogic'

describe('atmosphere lab logic', () => {
  it('formats configuration keys for a readable control label', () => {
    expect(formatConfigLabel('noiseTimeScale')).toBe('Noise Time Scale')
  })

  it('randomizes only the fluid controls exposed in the lab', () => {
    const fluid = randomizeFluidConfig(asciiAtmosphereConfig.fluid, () => 0)

    for (const control of fluidLabControls) {
      expect(fluid[control.key]).toBe(controlRangeFor('fluid', control.key).min)
    }

    expect(fluid.noiseScale).toBe(asciiAtmosphereConfig.fluid.noiseScale)
  })
})
