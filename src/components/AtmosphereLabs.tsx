/*
 * AtmosphereLabs
 *
 * The small coordinator for the two development-only atmosphere panels. It
 * shares a settings controller with them and stops their native pointer events
 * from reaching the hero; state updates themselves remain in the hook.
 */
import type { PointerEvent } from 'react'
import type { AtmosphereSettingsController } from '../hooks/useAtmosphereSettings'
import { SimulationLab } from './SimulationLab'
import { TrailLab } from './TrailLab'

type AtmosphereLabsProps = {
  controller: AtmosphereSettingsController
}

export function AtmosphereLabs({ controller }: AtmosphereLabsProps) {
  function keepLabPointerOutOfAtmosphere(
    event: PointerEvent<HTMLDetailsElement>,
  ) {
    event.stopPropagation()
  }

  return (
    <>
      <TrailLab
        settings={controller.trailSettings}
        onSettingChange={controller.setTrailSetting}
        onPointerEvent={keepLabPointerOutOfAtmosphere}
      />
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
