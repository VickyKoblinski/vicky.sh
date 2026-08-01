import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('introduces Vicky as a software developer', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Vicky Koblinski' })).toBeInTheDocument()
    expect(screen.getByText('Software developer')).toBeInTheDocument()
  })
})
