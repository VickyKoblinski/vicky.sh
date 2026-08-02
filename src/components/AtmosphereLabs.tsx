import type { PointerEvent } from 'react'
import type { AtmosphereSettingsController } from '../hooks/useAtmosphereSettings'
import { SimulationLab } from './SimulationLab'
import { TrailLab } from './TrailLab'

type AtmosphereLabsProps = {
  controller: AtmosphereSettingsController
}

export function AtmosphereLabs({ controller }: AtmosphereLabsProps) {
  function keepLabPointerOutOfAtmosphere(event: PointerEvent<HTMLDetailsElement>) {
    event.stopPropagation()
  }

  return (
    <>
      <TrailLab settings={controller.trailSettings} onSettingChange={controller.setTrailSetting} onPointerEvent={keepLabPointerOutOfAtmosphere} />
      <SimulationLab
        trailSettings={controller.trailSettings}
        atmosphereConfig={controller.atmosphereConfig}
        copyStatus={controller.copyStatus}
        onTrailSettingChange={controller.setTrailSetting}
        onConfigNumberChange={controller.setConfigNumber}
        onGridFontChange={controller.setGridFont}
        onGlyphSettingChange={controller.setGlyphSetting}
        onCopySettings={controller.copySettings}
        onRandomizeFluid={controller.randomizeFluid}
        onPointerEvent={keepLabPointerOutOfAtmosphere}
      />
    </>
  )
}
