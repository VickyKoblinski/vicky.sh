/*
 * AboutSection
 *
 * The personal-introduction section of the portfolio. It receives already
 * resolved profile content and only concerns itself with accessible layout;
 * content selection and page-level composition belong outside this component.
 */
import type { Profile } from '../content/profile'
import { kickerClass } from './siteStyles'

type AboutSectionProps = {
  about: Profile['about']
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section
      className="grid grid-cols-[.8fr_1.2fr] gap-[70px] py-[65px] max-[720px]:block max-[720px]:py-[52px]"
      id="about"
      aria-labelledby="about-title"
    >
      <div>
        <p className={kickerClass}>About</p>
        <h2
          className="m-0 max-w-[260px] text-[2rem] leading-[1.12] tracking-[-.043em] max-[720px]:mb-7"
          id="about-title"
        >
          {about.title}
        </h2>
      </div>
      <div className="max-w-[590px] text-[.95rem] leading-[1.7] text-[#45494f] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
