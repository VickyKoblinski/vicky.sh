import { describe, expect, it } from 'vitest'
import { createFluid, glyphForDensity } from './asciiFluid'

describe('ASCII fluid helpers', () => {
  it('maps density to the three glyph bands', () => {
    expect(glyphForDensity(.2)).toBeNull()
    expect(glyphForDensity(.4)?.glyph).toBe('—')
    expect(glyphForDensity(.8)?.glyph).toBe('>')
    expect(glyphForDensity(1.2)?.glyph).toBe('o')
  })

  it('creates a grid that covers the available space', () => {
    const fluid = createFluid(21, 11)

    expect(fluid.columns).toBe(3)
    expect(fluid.rows).toBe(2)
  })
})
