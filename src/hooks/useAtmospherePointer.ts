import { useRef, type PointerEventHandler, type RefObject } from 'react'
import type { AsciiAtmosphereHandle } from '../AsciiAtmosphere'

export type AtmospherePointerControls = {
  heroRef: RefObject<HTMLElement | null>
  atmosphereRef: RefObject<AsciiAtmosphereHandle | null>
  handlePointerMove: PointerEventHandler<HTMLElement>
  handlePointerDown: PointerEventHandler<HTMLElement>
}

export function useAtmospherePointer(): AtmospherePointerControls {
  const heroRef = useRef<HTMLElement>(null)
  const atmosphereRef = useRef<AsciiAtmosphereHandle>(null)

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

  return { heroRef, atmosphereRef, handlePointerMove, handlePointerDown }
}
