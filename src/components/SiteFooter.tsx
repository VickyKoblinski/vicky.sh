import type { Profile } from '../content/profile'

type SiteFooterProps = {
  name: Profile['name']
  githubUrl: Profile['links']['github']
  githubLabel: Profile['links']['githubLabel']
}

export function SiteFooter({ name, githubUrl, githubLabel }: SiteFooterProps) {
  return (
    <footer className="flex justify-between pt-[26px] pb-[38px] text-[.72rem] text-[#73777d] max-[720px]:flex-col max-[720px]:gap-[10px]">
      <span>
        © {new Date().getFullYear()} {name}
      </span>
      <a
        className="no-underline hover:text-[#8a3ffc]"
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
      >
        {githubLabel} ↗
      </a>
    </footer>
  )
}
