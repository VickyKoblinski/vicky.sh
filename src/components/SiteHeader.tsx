import type { Profile } from '../content/profile'

type SiteHeaderProps = {
  profile: Profile
}

export function SiteHeader({ profile }: SiteHeaderProps) {
  return (
    <header className="relative z-[2] flex items-center justify-between py-6">
      <a className="text-[.94rem] font-[650] tracking-[-.02em] no-underline" href="#top">{profile.name}</a>
      <nav className="flex gap-5 max-[720px]:gap-[14px]" aria-label="Main navigation">
        <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href="#experience">Experience</a>
        <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href="#about">About</a>
        <a className="text-[.8rem] text-[#3f4250] no-underline hover:text-[#8a3ffc]" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
  )
}
