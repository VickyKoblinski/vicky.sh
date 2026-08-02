/*
 * profile
 *
 * The profile-content boundary for the site. It loads committed placeholder
 * copy and safely prefers the ignored private profile when one exists; page
 * components consume the resolved object without knowing which source won.
 */
import mockProfile from './profile.mock.json'

export type Profile = typeof mockProfile

export function resolveProfile<T>(mock: T, local?: T): T {
  return local ?? mock
}

const localProfiles = import.meta.glob<{ default: Profile }>('./profile.json', {
  eager: true,
})
const localProfile = localProfiles['./profile.json']?.default

export const profile = resolveProfile(mockProfile, localProfile)
