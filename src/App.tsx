import { AboutSection } from './components/AboutSection'
import { AtmosphereLabs } from './components/AtmosphereLabs'
import { ExperienceSection } from './components/ExperienceSection'
import { HeroSection } from './components/HeroSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { profile } from './content/profile'
import { useAtmospherePointer } from './hooks/useAtmospherePointer'
import { useAtmosphereSettings } from './hooks/useAtmosphereSettings'

const showAtmosphereLabs = import.meta.env.DEV

export default function App() {
  const atmosphereSettings = useAtmosphereSettings()
  const atmospherePointer = useAtmospherePointer()

  return (
    <main className="mx-auto max-w-[1120px] px-8 font-sans text-[#202327] max-[720px]:px-5">
      <SiteHeader profile={profile} />
      <HeroSection
        profile={profile}
        trailSettings={atmosphereSettings.trailSettings}
        atmosphereConfig={atmosphereSettings.atmosphereConfig}
        heroRef={atmospherePointer.heroRef}
        atmosphereRef={atmospherePointer.atmosphereRef}
        onPointerMove={atmospherePointer.handlePointerMove}
        onPointerDown={atmospherePointer.handlePointerDown}
      >
        {showAtmosphereLabs ? <AtmosphereLabs controller={atmosphereSettings} /> : null}
      </HeroSection>
      <ExperienceSection experience={profile.experience} />
      <AboutSection about={profile.about} />
      <SiteFooter name={profile.name} githubUrl={profile.links.github} githubLabel={profile.links.githubLabel} />
    </main>
  )
}
