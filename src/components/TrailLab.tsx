import type { PointerEventHandler } from 'react'
import { asciiAtmosphereConfig, type TrailSettings } from '../asciiAtmosphereConfig'
import { outputClass, rangeInputClass, trailControlClass } from './siteStyles'

type TrailLabProps = {
  settings: TrailSettings
  onSettingChange: (key: keyof TrailSettings, value: number) => void
  onPointerEvent: PointerEventHandler<HTMLDetailsElement>
}

export function TrailLab({ settings, onSettingChange, onPointerEvent }: TrailLabProps) {
  return (
    <details className="absolute right-[max(32px,calc((100vw-1120px)/2+32px))] bottom-[18px] z-[2] w-[205px] rounded-lg border border-white/80 bg-white/85 px-3 py-[10px] text-[.72rem] max-[720px]:right-5" onPointerMove={onPointerEvent} onPointerDown={onPointerEvent}>
      <summary className="cursor-pointer font-bold">Trail lab <span className="ml-[6px] font-normal text-[#6d6b7a]">tinker with it</span></summary>
      {asciiAtmosphereConfig.trailControls.map(({ key, label, min, max }) => (
        <label className={trailControlClass} key={key}>
          {label}
          <input className={rangeInputClass} type="range" min={min} max={max} value={settings[key]} onChange={(event) => onSettingChange(key, Number(event.target.value))} />
          <output className={outputClass}>{settings[key]}</output>
        </label>
      ))}
    </details>
  )
}
