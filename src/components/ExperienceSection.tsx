import type { Profile } from '../content/profile'
import { kickerClass } from './siteStyles'

type ExperienceSectionProps = {
  experience: Profile['experience']
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section
      className="border-b border-[#d9d8d4] py-[65px] max-[720px]:py-[52px]"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="mb-[37px] grid grid-cols-[.8fr_1.2fr] max-[720px]:block">
        <p className={`${kickerClass} col-span-full`}>Experience</p>
        <h2
          className="m-0 text-[2rem] leading-[1.12] tracking-[-.043em]"
          id="experience-title"
        >
          {experience.title}
        </h2>
        <p className="mt-0.5 mb-0 max-w-[430px] text-[.9rem] leading-[1.55] text-[#5e6269] max-[720px]:mt-[18px]">
          {experience.intro}
        </p>
      </div>
      <div className="border-t border-[#d9d8d4]">
        {experience.positions.map((position) => (
          <article
            className="flex min-h-[76px] items-center justify-between border-b border-[#d9d8d4] py-[14px] pr-[9px] pl-0 transition-[background,padding] duration-150 hover:bg-[#f0eeea] hover:pl-[14px]"
            key={position.company}
          >
            <div>
              <h3 className="m-0 text-base tracking-[-.015em]">
                {position.company}
              </h3>
              <p className="mt-1 mb-0 text-[.78rem] text-[#73777d]">
                {position.role}
              </p>
            </div>
            {position.current ? (
              <span className="rounded-full border border-[#b6e1c2] bg-[#dff5e5] px-[9px] py-1 text-[.67rem] font-[650] text-[#2f6b44]">
                Now
              </span>
            ) : (
              <span className="text-[#8a3ffc]" aria-hidden="true">
                ↗
              </span>
            )}
          </article>
        ))}
      </div>
      <article
        className="mt-[38px] grid grid-cols-[.8fr_1.2fr] gap-8 bg-[#202327] p-[31px] text-[#f7f6f2] max-[720px]:block max-[720px]:p-6"
        aria-labelledby="encoura-title"
      >
        <p className="mt-[5px] mb-0 text-[.68rem] font-bold tracking-[.07em] text-[#c3b8ff] uppercase">
          {experience.detail.label}
        </p>
        <div>
          <h3
            className="m-0 text-[1.3rem] leading-[1.35] tracking-[-.025em] max-[720px]:my-[19px]"
            id="encoura-title"
          >
            {experience.detail.title}
          </h3>
          <div className="text-[.88rem] leading-[1.6] text-[#d0d2d5] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {experience.detail.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </section>
  )
}
