import { useRef, useState } from 'react'
import AsciiAtmosphere, { type AsciiAtmosphereHandle } from './AsciiAtmosphere'
import { asciiAtmosphereConfig, controlRangeFor, createAsciiAtmosphereConfig, fluidLabControls, initialTrailSettings, type AsciiAtmosphereConfig } from './asciiAtmosphereConfig'
import { profile } from './content/profile'

const lifetimeControl = asciiAtmosphereConfig.trailControls.find((control) => control.key === 'lifetime')!
const showAtmosphereLabs = import.meta.env.DEV

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
    <main className="page">
      <header className="header">
        <a className="name-link" href="#top">{profile.name}</a>
        <nav aria-label="Main navigation">
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="intro" id="top" ref={heroRef} onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}>
        <div className="atmosphere">
          <span className="orb orb-one" aria-hidden="true" />
          <span className="orb orb-two" aria-hidden="true" />
          <span className="orb orb-three" aria-hidden="true" />
          <AsciiAtmosphere ref={atmosphereRef} settings={trailSettings} config={atmosphereConfig} />
        </div>
        <div className="intro-main">
          <p className="kicker">{profile.hero.kicker}</p>
          <h1>{profile.name}</h1>
          <p className="role">{profile.hero.role}</p>
          <p className="summary">{profile.hero.summary}</p>
          <div className="links">
            <a href="#experience">{profile.hero.workLinkLabel} <span aria-hidden="true">↓</span></a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <aside className="note" aria-label="Current focus">
          <div className="note-top"><span className="status-dot" /> Currently</div>
          <p>{profile.currentFocus.description}</p>
          <ul>
            {profile.currentFocus.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
        {showAtmosphereLabs ? <>
        <details className="trail-lab" onPointerMove={keepLabInputOutOfAtmosphere} onPointerDown={keepLabInputOutOfAtmosphere}>
          <summary>Trail lab <span>tinker with it</span></summary>
          {asciiAtmosphereConfig.trailControls.map(({ key, label, min, max }) => (
            <label key={key}>{label}<input type="range" min={min} max={max} value={trailSettings[key]} onChange={(event) => setTrailSettings((current) => ({ ...current, [key]: Number(event.target.value) }))} /><output>{trailSettings[key]}</output></label>
          ))}
        </details>
        <details className="trail-lab simulation-lab" onPointerMove={keepLabInputOutOfAtmosphere} onPointerDown={keepLabInputOutOfAtmosphere}>
          <summary>Simulation lab <span>all the knobs</span></summary>
          <div className="lab-actions">
            <button type="button" onClick={copySettings}>{copyStatus}</button>
            <button type="button" onClick={randomizeFluid}>Randomize fluid</button>
          </div>
          {(['grid', 'color'] as const).map((section) => (
            <details key={section} className="config-group">
              <summary>{section}</summary>
              {Object.entries(atmosphereConfig[section]).filter(([, value]) => typeof value === 'number').map(([key, value]) => {
                const numericValue = Number(value)
                const range = controlRangeFor(section, key)
                return <label key={key}>
                  {formatConfigLabel(key)}
                  <input type="range" min={range.min} max={range.max} step={range.step} value={numericValue} onChange={(event) => updateConfigNumber(section, key, Number(event.target.value))} />
                  <output>{numericValue}</output>
                </label>
              })}
              {section === 'grid' ? <label>font<input value={atmosphereConfig.grid.font} onChange={(event) => updateGridFont(event.target.value)} /></label> : null}
            </details>
          ))}
          <details className="config-group" open>
            <summary>fluid behavior</summary>
            <label className="primary-fluid-control">
              <span>Fade duration<small>How long the trail remains before clearing away.</small></span>
              <input type="range" min={lifetimeControl.min} max={lifetimeControl.max} value={trailSettings.lifetime} onChange={(event) => setTrailSettings((current) => ({ ...current, lifetime: Number(event.target.value) }))} />
              <output>{trailSettings.lifetime}</output>
            </label>
            {fluidLabControls.map(({ key, label, description }) => {
              const range = controlRangeFor('fluid', key)
              return <label key={key} title={description}>
                <span>{label}<small>{description}</small></span>
                <input type="range" min={range.min} max={range.max} step={range.step} value={atmosphereConfig.fluid[key]} onChange={(event) => updateConfigNumber('fluid', key, Number(event.target.value))} />
                <output>{atmosphereConfig.fluid[key]}</output>
              </label>
            })}
          </details>
          <details className="config-group">
            <summary>glyph bands</summary>
            {atmosphereConfig.glyphBands.map((band, index) => (
              <fieldset key={`${band.glyph}-${index}`}>
                <legend>{band.glyph} band</legend>
                <label>glyph<input aria-label={`${band.glyph} glyph`} value={band.glyph} maxLength={1} onChange={(event) => updateGlyph(index, 'glyph', event.target.value)} /></label>
                {(['minimumDensity', 'shade', 'fontSize'] as const).map((key) => {
                  const range = key === 'minimumDensity' ? { min: .01, max: 3, step: .01 } : key === 'shade' ? { min: 0, max: 255, step: 1 } : { min: 6, max: 20, step: 1 }
                  return <label key={key}>{key}<input type="number" min={range.min} max={range.max} value={band[key]} step={range.step} onChange={(event) => updateGlyph(index, key, Number(event.target.value))} /></label>
                })}
              </fieldset>
            ))}
          </details>
        </details>
        </> : null}
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title">
        <div className="section-intro">
          <p className="kicker">Experience</p>
          <h2 id="experience-title">{profile.experience.title}</h2>
          <p>{profile.experience.intro}</p>
        </div>
        <div className="positions">
          {profile.experience.positions.map((position) => (
            <article className={position.current ? 'position current' : 'position'} key={position.company}>
              <div>
                <h3>{position.company}</h3>
                <p>{position.role}</p>
              </div>
              {position.current ? <span className="tag">Now</span> : <span className="arrow" aria-hidden="true">↗</span>}
            </article>
          ))}
        </div>
        <article className="encoura-detail" aria-labelledby="encoura-title">
          <p className="detail-label">{profile.experience.detail.label}</p>
          <h3 id="encoura-title">{profile.experience.detail.title}</h3>
          <div>
            {profile.experience.detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </article>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div><p className="kicker">About</p><h2 id="about-title">{profile.about.title}</h2></div>
        <div>{profile.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <footer><span>© {new Date().getFullYear()} {profile.name}</span><a href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.githubLabel} ↗</a></footer>
    </main>
  )
}
