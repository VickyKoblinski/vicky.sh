/*
 * SimulationLab
 *
 * The detailed development-only interface for inspecting and tuning atmosphere
 * settings. It receives all data and actions from the settings hook; simulation
 * rules and state changes belong in the hook and utility modules, not this form.
 */
import type { PointerEventHandler } from 'react'
import {
  asciiAtmosphereConfig,
  controlRangeFor,
  fluidLabControls,
  type AsciiAtmosphereConfig,
  type GlyphBand,
  type TrailSettings,
} from '../asciiAtmosphereConfig'
import { formatConfigLabel } from '../atmosphereLabLogic'
import {
  outputClass,
  simulationControlClass,
  simulationRangeClass,
  textInputClass,
} from './siteStyles'

const lifetimeControl = asciiAtmosphereConfig.trailControls.find(
  (control) => control.key === 'lifetime',
)!
type NumericConfigSection = 'grid' | 'color' | 'fluid'

type SimulationLabProps = {
  trailSettings: TrailSettings
  atmosphereConfig: AsciiAtmosphereConfig
  copyStatus: string
  onTrailSettingChange: (key: keyof TrailSettings, value: number) => void
  onConfigNumberChange: (
    section: NumericConfigSection,
    key: string,
    value: number,
  ) => void
  onGridFontChange: (font: string) => void
  onGlyphSettingChange: (
    index: number,
    key: keyof GlyphBand,
    value: number | string,
  ) => void
  onCopySettings: () => Promise<void>
  onRandomizeFluid: () => void
  onPointerEvent: PointerEventHandler<HTMLDetailsElement>
}

type NumericConfigurationSectionProps = {
  section: 'grid' | 'color'
  values: AsciiAtmosphereConfig['grid'] | AsciiAtmosphereConfig['color']
  onConfigNumberChange: SimulationLabProps['onConfigNumberChange']
  onGridFontChange: SimulationLabProps['onGridFontChange']
}

function NumericConfigurationSection({
  section,
  values,
  onConfigNumberChange,
  onGridFontChange,
}: NumericConfigurationSectionProps) {
  return (
    <details className="mt-3 border-t border-[#ddd9e9] pt-[10px]">
      <summary className="cursor-pointer text-[.72rem] text-[#45405a] capitalize">
        {section}
      </summary>
      {Object.entries(values)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => {
          const numericValue = Number(value)
          const range = controlRangeFor(section, key)
          return (
            <label className={simulationControlClass} key={key}>
              {formatConfigLabel(key)}
              <input
                className={simulationRangeClass}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={numericValue}
                onChange={(event) =>
                  onConfigNumberChange(section, key, Number(event.target.value))
                }
              />
              <output className={outputClass}>{numericValue}</output>
            </label>
          )
        })}
      {section === 'grid' ? (
        <label className={simulationControlClass}>
          font
          <input
            className={`${textInputClass} col-start-2`}
            value={values.font}
            onChange={(event) => onGridFontChange(event.target.value)}
          />
        </label>
      ) : null}
    </details>
  )
}

type FluidControlsProps = Pick<
  SimulationLabProps,
  | 'trailSettings'
  | 'atmosphereConfig'
  | 'onTrailSettingChange'
  | 'onConfigNumberChange'
>

function FluidControls({
  trailSettings,
  atmosphereConfig,
  onTrailSettingChange,
  onConfigNumberChange,
}: FluidControlsProps) {
  return (
    <details className="mt-3 border-t border-[#ddd9e9] pt-[10px]" open>
      <summary className="cursor-pointer text-[.72rem] text-[#45405a] capitalize">
        fluid behavior
      </summary>
      <label className={simulationControlClass}>
        <span className="min-w-0">
          Fade duration
          <small className="mt-0.5 block text-[.62rem] leading-[1.25] text-[#77728b]">
            How long the trail remains before clearing away.
          </small>
        </span>
        <input
          className={simulationRangeClass}
          type="range"
          min={lifetimeControl.min}
          max={lifetimeControl.max}
          value={trailSettings.lifetime}
          onChange={(event) =>
            onTrailSettingChange('lifetime', Number(event.target.value))
          }
        />
        <output className={outputClass}>{trailSettings.lifetime}</output>
      </label>
      {fluidLabControls.map(({ key, label, description }) => {
        const range = controlRangeFor('fluid', key)
        return (
          <label
            className={simulationControlClass}
            key={key}
            title={description}
          >
            <span className="min-w-0">
              {label}
              <small className="mt-0.5 block text-[.62rem] leading-[1.25] text-[#77728b]">
                {description}
              </small>
            </span>
            <input
              className={simulationRangeClass}
              type="range"
              min={range.min}
              max={range.max}
              step={range.step}
              value={atmosphereConfig.fluid[key]}
              onChange={(event) =>
                onConfigNumberChange('fluid', key, Number(event.target.value))
              }
            />
            <output className={outputClass}>
              {atmosphereConfig.fluid[key]}
            </output>
          </label>
        )
      })}
    </details>
  )
}

type GlyphBandControlsProps = Pick<
  SimulationLabProps,
  'atmosphereConfig' | 'onGlyphSettingChange'
>

function GlyphBandControls({
  atmosphereConfig,
  onGlyphSettingChange,
}: GlyphBandControlsProps) {
  return (
    <details className="mt-3 border-t border-[#ddd9e9] pt-[10px]">
      <summary className="cursor-pointer text-[.72rem] text-[#45405a] capitalize">
        glyph bands
      </summary>
      {atmosphereConfig.glyphBands.map((band, index) => (
        <fieldset
          className="mt-[10px] grid min-w-0 gap-[6px] rounded-[5px] border border-[#ded9e8] p-2"
          key={`${band.glyph}-${index}`}
        >
          <legend className="px-[3px] text-[#625a77]">{band.glyph} band</legend>
          <label className="grid grid-cols-[1fr_minmax(80px,1fr)] items-center gap-[5px]">
            glyph
            <input
              className={textInputClass}
              aria-label={`${band.glyph} glyph`}
              value={band.glyph}
              maxLength={1}
              onChange={(event) =>
                onGlyphSettingChange(index, 'glyph', event.target.value)
              }
            />
          </label>
          {(['minimumDensity', 'shade', 'fontSize'] as const).map((key) => {
            const range =
              key === 'minimumDensity'
                ? { min: 0.01, max: 3, step: 0.01 }
                : key === 'shade'
                  ? { min: 0, max: 255, step: 1 }
                  : { min: 6, max: 20, step: 1 }
            return (
              <label
                className="grid grid-cols-[1fr_minmax(80px,1fr)] items-center gap-[5px]"
                key={key}
              >
                {key}
                <input
                  className={textInputClass}
                  type="number"
                  min={range.min}
                  max={range.max}
                  value={band[key]}
                  step={range.step}
                  onChange={(event) =>
                    onGlyphSettingChange(index, key, Number(event.target.value))
                  }
                />
              </label>
            )
          })}
        </fieldset>
      ))}
    </details>
  )
}

export function SimulationLab({
  trailSettings,
  atmosphereConfig,
  copyStatus,
  onTrailSettingChange,
  onConfigNumberChange,
  onGridFontChange,
  onGlyphSettingChange,
  onCopySettings,
  onRandomizeFluid,
  onPointerEvent,
}: SimulationLabProps) {
  return (
    <details
      className="fixed right-[18px] bottom-[18px] z-20 max-h-[calc(100dvh-36px)] w-[min(390px,calc(100vw-36px))] [scrollbar-color:#afa9c4_transparent] overflow-auto rounded-lg border border-white/80 bg-white/85 px-3 py-[10px] text-[.72rem] max-[720px]:right-3 max-[720px]:bottom-3 max-[720px]:w-[calc(100vw-24px)] [&:not([open])]:max-h-none [&:not([open])]:w-[205px] [&:not([open])]:overflow-hidden"
      onPointerMove={onPointerEvent}
      onPointerDown={onPointerEvent}
    >
      <summary className="sticky -top-[10px] z-[1] cursor-pointer font-bold">
        Simulation lab{' '}
        <span className="ml-[6px] font-normal text-[#6d6b7a]">
          all the knobs
        </span>
      </summary>
      <div className="mt-3 flex flex-wrap gap-[6px]">
        <button
          className="min-w-[100px] flex-1 cursor-pointer rounded border border-[#d8d1e9] bg-[#f4f1fb] px-2 py-[6px] font-[inherit] font-[650] text-[#4f3b87] hover:bg-[#eae4f8]"
          type="button"
          onClick={onCopySettings}
        >
          {copyStatus}
        </button>
        <button
          className="min-w-[100px] flex-1 cursor-pointer rounded border border-[#d8d1e9] bg-[#f4f1fb] px-2 py-[6px] font-[inherit] font-[650] text-[#4f3b87] hover:bg-[#eae4f8]"
          type="button"
          onClick={onRandomizeFluid}
        >
          Randomize fluid
        </button>
      </div>
      <NumericConfigurationSection
        section="grid"
        values={atmosphereConfig.grid}
        onConfigNumberChange={onConfigNumberChange}
        onGridFontChange={onGridFontChange}
      />
      <NumericConfigurationSection
        section="color"
        values={atmosphereConfig.color}
        onConfigNumberChange={onConfigNumberChange}
        onGridFontChange={onGridFontChange}
      />
      <FluidControls
        trailSettings={trailSettings}
        atmosphereConfig={atmosphereConfig}
        onTrailSettingChange={onTrailSettingChange}
        onConfigNumberChange={onConfigNumberChange}
      />
      <GlyphBandControls
        atmosphereConfig={atmosphereConfig}
        onGlyphSettingChange={onGlyphSettingChange}
      />
    </details>
  )
}
