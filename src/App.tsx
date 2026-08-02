import { useRef, useState } from 'react'
import AsciiAtmosphere, { type AsciiAtmosphereHandle } from './AsciiAtmosphere'
import { asciiAtmosphereConfig, controlRangeFor, createAsciiAtmosphereConfig, fluidLabControls, initialTrailSettings, type AsciiAtmosphereConfig } from './asciiAtmosphereConfig'
import { profile } from './content/profile'

const lifetimeControl = asciiAtmosphereConfig.trailControls.find((control) => control.key === 'lifetime')!
const showAtmosphereLabs = import.meta.env.DEV
const kickerClass = 'm-0 mb-[17px] text-[.7rem] font-[650] uppercase tracking-[.09em] text-[#565869]'
const trailControlClass = 'mt-[9px] grid grid-cols-[minmax(0,1fr)_75px_30px] items-center gap-[5px]'
const rangeInputClass = 'm-0 min-w-0 w-[75px] accent-[#6f4cc3]'
const outputClass = 'text-right text-[#6d6b7a]'
const simulationControlClass = 'mt-[9px] grid grid-cols-[minmax(105px,1fr)_minmax(120px,1.5fr)_54px] items-center gap-[5px] leading-[1.2]'
const simulationRangeClass = 'm-0 min-w-0 w-full accent-[#6f4cc3]'
const textInputClass = 'w-full rounded border border-[#d5d0e0] bg-white px-[6px] py-[5px] font-inherit text-[#363244]'

export default function App() {
  const heroRef = useRef<HTMLElement>(null)
  const atmosphereRef = useRef<AsciiAtmosphereHandle>(null)
  const [trailSettings, setTrailSettings] = useState(initialTrailSettings)
  const [atmosphereConfig, setAtmosphereConfig] = useState(createAsciiAtmosphereConfig)
  const [copyStatus, setCopyStatus] = useState('Copy JSON')

  function updateConfigNumber(section: 'grid' | 'color' | 'fluid', key: string, value: number) {
    setAtmosphereConfig((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }) as AsciiAtmosphereConfig)
  }

  function updateGridFont(font: string) {
    setAtmosphereConfig((current) => ({ ...current, grid: { ...current.grid, font } }))
  }

  function updateGlyph(index: number, key: 'minimumDensity' | 'shade' | 'fontSize' | 'glyph', value: number | string) {
    setAtmosphereConfig((current) => ({
      ...current,
      glyphBands: current.glyphBands.map((band, bandIndex) => bandIndex === index ? { ...band, [key]: value } : band),
    }))
  }

  function formatConfigLabel(key: string) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase())
  }

  function randomizeFluid() {
    setAtmosphereConfig((current) => ({
      ...current,
      fluid: Object.fromEntries(Object.keys(current.fluid).map((key) => {
        if (!fluidLabControls.some((control) => control.key === key)) return [key, current.fluid[key]]
        const range = controlRangeFor('fluid', key)
        const steps = Math.floor((range.max - range.min) / range.step)
        const value = range.min + Math.floor(Math.random() * (steps + 1)) * range.step
        return [key, Number(value.toFixed(6))]
      })),
    }) as AsciiAtmosphereConfig)
  }

  async function copySettings() {
    const exportText = JSON.stringify({ trailSettings, atmosphereConfig }, null, 2)
    try {
      await navigator.clipboard.writeText(exportText)
      setCopyStatus('Copied!')
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const hero = heroRef.current
    if (!hero) return

    const bounds = hero.getBoundingClientRect()
    atmosphereRef.current?.move(event.clientX - bounds.left, event.clientY - bounds.top)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    atmosphereRef.current?.burst(event.clientX - bounds.left, event.clientY - bounds.top)
  }

  function keepLabInputOutOfAtmosphere(event: React.PointerEvent<HTMLElement>) {
    event.stopPropagation()
  }

  return (
    <main className="mx-auto max-w-[1120px] px-8 font-sans text-[#202327] max-[720px]:px-5">
      <header className="relative z-[2] flex items-center justify-between py-6">
        <a className="text-[.94rem] font-[650] tracking-[-.02em] no-underline" href="#top">{profile.name}</a>
        <nav className="flex gap-5 max-[720px]:gap-[14px]" aria-label="Main navigation">
          <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href="#experience">Experience</a>
          <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href="#about">About</a>
          <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="relative isolate -mt-[72px] -mx-[calc(50vw-50%)] grid grid-cols-[minmax(0,1fr)_290px] gap-[72px] overflow-hidden border-b border-[#d9d8d4] bg-[#e8e7f5] px-[max(32px,calc((100vw-1120px)/2+32px))] pt-[150px] pb-[65px] max-[720px]:block max-[720px]:px-5 max-[720px]:pt-[52px] max-[720px]:pb-[190px]" id="top" ref={heroRef} onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}>
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
        <aside className="relative z-[1] self-end rounded-lg border border-white/80 bg-white/55 px-5 py-[19px] shadow-[0_10px_35px_#5036851c] backdrop-blur-[15px] max-[720px]:mt-[42px] max-[720px]:max-w-[360px]" aria-label="Current focus">
          <div className="text-[.68rem] font-bold uppercase tracking-[.07em] text-[#635b87]"><span className="mr-[7px] inline-block size-2 rounded-full bg-[#54a66d]" /> Currently</div>
          <p className="my-[14px] text-[.92rem] leading-[1.52]">{profile.currentFocus.description}</p>
          <ul className="m-0 list-none p-0 text-[.74rem] leading-[1.75] text-[#5e5a77]">
            {profile.currentFocus.items.map((item) => <li className="before:content-['—_']" key={item}>{item}</li>)}
          </ul>
        </aside>
        {showAtmosphereLabs ? <>
        <details className="absolute right-[max(32px,calc((100vw-1120px)/2+32px))] bottom-[18px] z-[2] w-[205px] rounded-lg border border-white/80 bg-white/85 px-3 py-[10px] text-[.72rem] max-[720px]:right-5" onPointerMove={keepLabInputOutOfAtmosphere} onPointerDown={keepLabInputOutOfAtmosphere}>
          <summary className="cursor-pointer font-bold">Trail lab <span className="ml-[6px] font-normal text-[#6d6b7a]">tinker with it</span></summary>
          {asciiAtmosphereConfig.trailControls.map(({ key, label, min, max }) => (
            <label className={trailControlClass} key={key}>{label}<input className={rangeInputClass} type="range" min={min} max={max} value={trailSettings[key]} onChange={(event) => setTrailSettings((current) => ({ ...current, [key]: Number(event.target.value) }))} /><output className={outputClass}>{trailSettings[key]}</output></label>
          ))}
        </details>
        <details className="fixed right-[18px] bottom-[18px] z-20 max-h-[calc(100dvh-36px)] w-[min(390px,calc(100vw-36px))] overflow-auto rounded-lg border border-white/80 bg-white/85 px-3 py-[10px] text-[.72rem] [scrollbar-color:#afa9c4_transparent] [&:not([open])]:max-h-none [&:not([open])]:w-[205px] [&:not([open])]:overflow-hidden max-[720px]:right-3 max-[720px]:bottom-3 max-[720px]:w-[calc(100vw-24px)]" onPointerMove={keepLabInputOutOfAtmosphere} onPointerDown={keepLabInputOutOfAtmosphere}>
          <summary className="sticky -top-[10px] z-[1] cursor-pointer font-bold">Simulation lab <span className="ml-[6px] font-normal text-[#6d6b7a]">all the knobs</span></summary>
          <div className="mt-3 flex flex-wrap gap-[6px]">
            <button className="min-w-[100px] flex-1 cursor-pointer rounded border border-[#d8d1e9] bg-[#f4f1fb] px-2 py-[6px] font-[inherit] font-[650] text-[#4f3b87] hover:bg-[#eae4f8]" type="button" onClick={copySettings}>{copyStatus}</button>
            <button className="min-w-[100px] flex-1 cursor-pointer rounded border border-[#d8d1e9] bg-[#f4f1fb] px-2 py-[6px] font-[inherit] font-[650] text-[#4f3b87] hover:bg-[#eae4f8]" type="button" onClick={randomizeFluid}>Randomize fluid</button>
          </div>
          {(['grid', 'color'] as const).map((section) => (
            <details key={section} className="mt-3 border-t border-[#ddd9e9] pt-[10px]">
              <summary className="cursor-pointer text-[.72rem] capitalize text-[#45405a]">{section}</summary>
              {Object.entries(atmosphereConfig[section]).filter(([, value]) => typeof value === 'number').map(([key, value]) => {
                const numericValue = Number(value)
                const range = controlRangeFor(section, key)
                return <label className={simulationControlClass} key={key}>
                  {formatConfigLabel(key)}
                  <input className={simulationRangeClass} type="range" min={range.min} max={range.max} step={range.step} value={numericValue} onChange={(event) => updateConfigNumber(section, key, Number(event.target.value))} />
                  <output className={outputClass}>{numericValue}</output>
                </label>
              })}
              {section === 'grid' ? <label className={simulationControlClass}>font<input className={`${textInputClass} col-start-2`} value={atmosphereConfig.grid.font} onChange={(event) => updateGridFont(event.target.value)} /></label> : null}
            </details>
          ))}
          <details className="mt-3 border-t border-[#ddd9e9] pt-[10px]" open>
            <summary className="cursor-pointer text-[.72rem] capitalize text-[#45405a]">fluid behavior</summary>
            <label className={simulationControlClass}>
              <span className="min-w-0">Fade duration<small className="mt-0.5 block text-[.62rem] leading-[1.25] text-[#77728b]">How long the trail remains before clearing away.</small></span>
              <input className={simulationRangeClass} type="range" min={lifetimeControl.min} max={lifetimeControl.max} value={trailSettings.lifetime} onChange={(event) => setTrailSettings((current) => ({ ...current, lifetime: Number(event.target.value) }))} />
              <output className={outputClass}>{trailSettings.lifetime}</output>
            </label>
            {fluidLabControls.map(({ key, label, description }) => {
              const range = controlRangeFor('fluid', key)
              return <label className={simulationControlClass} key={key} title={description}>
                <span className="min-w-0">{label}<small className="mt-0.5 block text-[.62rem] leading-[1.25] text-[#77728b]">{description}</small></span>
                <input className={simulationRangeClass} type="range" min={range.min} max={range.max} step={range.step} value={atmosphereConfig.fluid[key]} onChange={(event) => updateConfigNumber('fluid', key, Number(event.target.value))} />
                <output className={outputClass}>{atmosphereConfig.fluid[key]}</output>
              </label>
            })}
          </details>
          <details className="mt-3 border-t border-[#ddd9e9] pt-[10px]">
            <summary className="cursor-pointer text-[.72rem] capitalize text-[#45405a]">glyph bands</summary>
            {atmosphereConfig.glyphBands.map((band, index) => (
              <fieldset className="mt-[10px] grid min-w-0 gap-[6px] rounded-[5px] border border-[#ded9e8] p-2" key={`${band.glyph}-${index}`}>
                <legend className="px-[3px] text-[#625a77]">{band.glyph} band</legend>
                <label className="grid grid-cols-[1fr_minmax(80px,1fr)] items-center gap-[5px]">glyph<input className={textInputClass} aria-label={`${band.glyph} glyph`} value={band.glyph} maxLength={1} onChange={(event) => updateGlyph(index, 'glyph', event.target.value)} /></label>
                {(['minimumDensity', 'shade', 'fontSize'] as const).map((key) => {
                  const range = key === 'minimumDensity' ? { min: .01, max: 3, step: .01 } : key === 'shade' ? { min: 0, max: 255, step: 1 } : { min: 6, max: 20, step: 1 }
                  return <label className="grid grid-cols-[1fr_minmax(80px,1fr)] items-center gap-[5px]" key={key}>{key}<input className={textInputClass} type="number" min={range.min} max={range.max} value={band[key]} step={range.step} onChange={(event) => updateGlyph(index, key, Number(event.target.value))} /></label>
                })}
              </fieldset>
            ))}
          </details>
        </details>
        </> : null}
      </section>

      <section className="border-b border-[#d9d8d4] py-[65px] max-[720px]:py-[52px]" id="experience" aria-labelledby="experience-title">
        <div className="mb-[37px] grid grid-cols-[.8fr_1.2fr] max-[720px]:block">
          <p className={`${kickerClass} col-span-full`}>Experience</p>
          <h2 className="m-0 text-[2rem] leading-[1.12] tracking-[-.043em]" id="experience-title">{profile.experience.title}</h2>
          <p className="mt-0.5 mb-0 max-w-[430px] text-[.9rem] leading-[1.55] text-[#5e6269] max-[720px]:mt-[18px]">{profile.experience.intro}</p>
        </div>
        <div className="border-t border-[#d9d8d4]">
          {profile.experience.positions.map((position) => (
            <article className="flex min-h-[76px] items-center justify-between border-b border-[#d9d8d4] py-[14px] pr-[9px] pl-0 transition-[background,padding] duration-150 hover:bg-[#f0eeea] hover:pl-[14px]" key={position.company}>
              <div>
                <h3 className="m-0 text-base tracking-[-.015em]">{position.company}</h3>
                <p className="mt-1 mb-0 text-[.78rem] text-[#73777d]">{position.role}</p>
              </div>
              {position.current ? <span className="rounded-full border border-[#b6e1c2] bg-[#dff5e5] px-[9px] py-1 text-[.67rem] font-[650] text-[#2f6b44]">Now</span> : <span className="text-[#8a3ffc]" aria-hidden="true">↗</span>}
            </article>
          ))}
        </div>
        <article className="mt-[38px] grid grid-cols-[.8fr_1.2fr] gap-8 bg-[#202327] p-[31px] text-[#f7f6f2] max-[720px]:block max-[720px]:p-6" aria-labelledby="encoura-title">
          <p className="mt-[5px] mb-0 text-[.68rem] font-bold uppercase tracking-[.07em] text-[#c3b8ff]">{profile.experience.detail.label}</p>
          <div>
            <h3 className="m-0 text-[1.3rem] leading-[1.35] tracking-[-.025em] max-[720px]:my-[19px]" id="encoura-title">{profile.experience.detail.title}</h3>
            <div className="text-[.88rem] leading-[1.6] text-[#d0d2d5] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
              {profile.experience.detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-[.8fr_1.2fr] gap-[70px] py-[65px] max-[720px]:block max-[720px]:py-[52px]" id="about" aria-labelledby="about-title">
        <div><p className={kickerClass}>About</p><h2 className="m-0 max-w-[260px] text-[2rem] leading-[1.12] tracking-[-.043em] max-[720px]:mb-7" id="about-title">{profile.about.title}</h2></div>
        <div className="max-w-[590px] text-[.95rem] leading-[1.7] text-[#45494f] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{profile.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <footer className="flex justify-between pt-[26px] pb-[38px] text-[.72rem] text-[#73777d] max-[720px]:flex-col max-[720px]:gap-[10px]"><span>© {new Date().getFullYear()} {profile.name}</span><a className="no-underline hover:text-[#8a3ffc]" href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.githubLabel} ↗</a></footer>
    </main>
  )
}
