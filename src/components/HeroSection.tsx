import type { PointerEventHandler, ReactNode, RefObject } from 'react'
import AsciiAtmosphere, { type AsciiAtmosphereHandle } from '../AsciiAtmosphere'
import type { AsciiAtmosphereConfig, TrailSettings } from '../asciiAtmosphereConfig'
import type { Profile } from '../content/profile'
import { CurrentFocusCard } from './CurrentFocusCard'
import { kickerClass } from './siteStyles'

type HeroSectionProps = {
  profile: Profile
  trailSettings: TrailSettings
  atmosphereConfig: AsciiAtmosphereConfig
  heroRef: RefObject<HTMLElement | null>
  atmosphereRef: RefObject<AsciiAtmosphereHandle | null>
  onPointerMove: PointerEventHandler<HTMLElement>
  onPointerDown: PointerEventHandler<HTMLElement>
  children?: ReactNode
}

export function HeroSection({
  profile,
  trailSettings,
  atmosphereConfig,
  heroRef,
  atmosphereRef,
  onPointerMove,
  onPointerDown,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative isolate -mt-[72px] -mx-[calc(50vw-50%)] grid grid-cols-[minmax(0,1fr)_290px] gap-[72px] overflow-hidden border-b border-[#d9d8d4] bg-[#e8e7f5] px-[max(32px,calc((100vw-1120px)/2+32px))] pt-[150px] pb-[65px] max-[720px]:block max-[720px]:px-5 max-[720px]:pt-[52px] max-[720px]:pb-[190px]" id="top" ref={heroRef} onPointerMove={onPointerMove} onPointerDown={onPointerDown}>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute -top-[190px] -left-[100px] size-[380px] w-[500px] rounded-full bg-[#9da9ff] opacity-65 blur-[45px] motion-safe:animate-drift-one" aria-hidden="true" />
        <span className="absolute top-[12%] right-[10%] size-[300px] w-[330px] rounded-full bg-[#e3a8ff] opacity-65 blur-[45px] motion-safe:animate-drift-two" aria-hidden="true" />
        <span className="absolute -bottom-[180px] left-[27%] size-[360px] w-[440px] rounded-full bg-[#b9f0dc] opacity-65 blur-[45px] motion-safe:animate-drift-three" aria-hidden="true" />
        <AsciiAtmosphere ref={atmosphereRef} settings={trailSettings} config={atmosphereConfig} />
      </div>
      <div className="relative z-[1]">
        <p className={kickerClass}>{profile.hero.kicker}</p>
        <h1 className="m-0 text-[clamp(2.65rem,5vw,4.5rem)] leading-none tracking-[-.058em] max-[720px]:text-[2.75rem]">{profile.name}</h1>
        <p className="mt-4 mb-0 text-base font-semibold text-[#583ab7]">{profile.hero.role}</p>
        <p className="mt-[26px] mb-0 max-w-[600px] text-[1.07rem] leading-[1.65]">{profile.hero.summary}</p>
        <div className="mt-7 flex gap-[22px]">
          <a className="border-b border-[#74768a] pb-1 text-[.82rem] font-semibold no-underline hover:text-[#8a3ffc]" href="#experience">{profile.hero.workLinkLabel} <span className="ml-1" aria-hidden="true">↓</span></a>
          <a className="border-b border-[#74768a] pb-1 text-[.82rem] font-semibold no-underline hover:text-[#8a3ffc]" href={profile.links.github} target="_blank" rel="noreferrer">GitHub <span className="ml-1" aria-hidden="true">↗</span></a>
        </div>
      </div>
      <CurrentFocusCard focus={profile.currentFocus} />
      {children}
    </section>
  )
}
