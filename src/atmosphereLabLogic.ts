import { controlRangeFor, fluidLabControls } from './asciiAtmosphereConfig'

export function formatConfigLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (character) => character.toUpperCase())
}

export function randomizeFluidConfig(
  fluid: Record<string, number>,
  random = Math.random,
) {
  return Object.fromEntries(
    Object.entries(fluid).map(([key, currentValue]) => {
      if (!fluidLabControls.some((control) => control.key === key))
        return [key, currentValue]

      const range = controlRangeFor('fluid', key)
      const steps = Math.floor((range.max - range.min) / range.step)
      const value = range.min + Math.floor(random() * (steps + 1)) * range.step
      return [key, Number(value.toFixed(6))]
    }),
  )
}
