import { render, screen, within } from '@testing-library/react'
import App from './App'
import { profile } from './content/profile'

describe('App', () => {
  it('presents the selected profile content', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: profile.name }),
    ).toBeInTheDocument()
    expect(screen.getByText(profile.hero.role)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'GitHub' })[0]).toHaveAttribute(
      'href',
      profile.links.github,
    )
    expect(
      screen.getByRole('img', { name: 'Interactive ASCII atmosphere' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Copy JSON' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Randomize fluid' }),
    ).toBeInTheDocument()
    const currentPosition = profile.experience.positions.find(
      (position) => position.current,
    )
    expect(currentPosition).toBeDefined()
    const currentHeading = screen.getByRole('heading', {
      name: currentPosition?.company,
    })
    const currentArticle = currentHeading.closest('article')
    expect(currentArticle).not.toBeNull()
    expect(
      within(currentArticle as HTMLElement).getByText(
        currentPosition?.role ?? '',
      ),
    ).toBeInTheDocument()
  })
})
