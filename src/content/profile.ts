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
