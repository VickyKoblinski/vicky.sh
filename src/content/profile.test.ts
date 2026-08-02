import { describe, expect, it } from 'vitest'
import { resolveProfile } from './profile'

describe('resolveProfile', () => {
  it('uses the committed mock profile when no private profile is present', () => {
    expect(resolveProfile({ name: 'Mock' })).toEqual({ name: 'Mock' })
  })

  it('prefers a private profile when one is available', () => {
    expect(resolveProfile({ name: 'Mock' }, { name: 'Private' })).toEqual({ name: 'Private' })
  })
})
