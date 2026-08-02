/*
 * useAtmosphereSettings
 *
 * The stateful API behind the atmosphere controls. It exposes named updates,
 * copying, and randomization actions to UI components; pure transformations
 * belong in atmosphereLabLogic, not among hook state transitions.
 */
import { useState } from 'react'
import {
  createAsciiAtmosphereConfig,
  initialTrailSettings,
  type AsciiAtmosphereConfig,
  type GlyphBand,
  type TrailSettings,
} from '../asciiAtmosphereConfig'
import { randomizeFluidConfig } from '../atmosphereLabLogic'

type NumericConfigSection = 'grid' | 'color' | 'fluid'
type GlyphSetting = keyof GlyphBand

export type AtmosphereSettingsController = {
  trailSettings: TrailSettings
  atmosphereConfig: AsciiAtmosphereConfig
  copyStatus: string
  setTrailSetting: (key: keyof TrailSettings, value: number) => void
  setConfigNumber: (
    section: NumericConfigSection,
    key: string,
    value: number,
  ) => void
  setGridFont: (font: string) => void
  setGlyphSetting: (
    index: number,
    key: GlyphSetting,
    value: number | string,
  ) => void
  randomizeFluid: () => void
  copySettings: () => Promise<void>
}

export function useAtmosphereSettings(): AtmosphereSettingsController {
  const [trailSettings, setTrailSettings] = useState(initialTrailSettings)
  const [atmosphereConfig, setAtmosphereConfig] = useState(
    createAsciiAtmosphereConfig,
  )
  const [copyStatus, setCopyStatus] = useState('Copy JSON')

  function setTrailSetting(key: keyof TrailSettings, value: number) {
    setTrailSettings((current) => ({ ...current, [key]: value }))
  }

  function setConfigNumber(
    section: NumericConfigSection,
    key: string,
    value: number,
  ) {
    setAtmosphereConfig(
      (current) =>
        ({
          ...current,
          [section]: { ...current[section], [key]: value },
        }) as AsciiAtmosphereConfig,
    )
  }

  function setGridFont(font: string) {
    setAtmosphereConfig((current) => ({
      ...current,
      grid: { ...current.grid, font },
    }))
  }

  function setGlyphSetting(
    index: number,
    key: GlyphSetting,
    value: number | string,
  ) {
    setAtmosphereConfig((current) => ({
      ...current,
      glyphBands: current.glyphBands.map((band, bandIndex) =>
        bandIndex === index ? { ...band, [key]: value } : band,
      ),
    }))
  }

  function randomizeFluid() {
    setAtmosphereConfig((current) => ({
      ...current,
      fluid: randomizeFluidConfig(current.fluid),
    }))
  }

  async function copySettings() {
    const exportText = JSON.stringify(
      { trailSettings, atmosphereConfig },
      null,
      2,
    )
    try {
      await navigator.clipboard.writeText(exportText)
      setCopyStatus('Copied!')
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  return {
    trailSettings,
    atmosphereConfig,
    copyStatus,
    setTrailSetting,
    setConfigNumber,
    setGridFont,
    setGlyphSetting,
    randomizeFluid,
    copySettings,
  }
}
