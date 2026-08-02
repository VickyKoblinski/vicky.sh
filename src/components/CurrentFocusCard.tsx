import type { Profile } from '../content/profile'

type CurrentFocusCardProps = {
  focus: Profile['currentFocus']
}

export function CurrentFocusCard({ focus }: CurrentFocusCardProps) {
  return (
    <aside
      className="relative z-[1] self-end rounded-lg border border-white/80 bg-white/55 px-5 py-[19px] shadow-[0_10px_35px_#5036851c] backdrop-blur-[15px] max-[720px]:mt-[42px] max-[720px]:max-w-[360px]"
      aria-label="Current focus"
    >
      <div className="text-[.68rem] font-bold tracking-[.07em] text-[#635b87] uppercase">
        <span className="mr-[7px] inline-block size-2 rounded-full bg-[#54a66d]" />{' '}
        Currently
      </div>
      <p className="my-[14px] text-[.92rem] leading-[1.52]">
        {focus.description}
      </p>
      <ul className="m-0 list-none p-0 text-[.74rem] leading-[1.75] text-[#5e5a77]">
        {focus.items.map((item) => (
          <li className="before:content-['—_']" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
