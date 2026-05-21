import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NoteCard from '../../../components/notes/NoteCard'

const note = {
  id: '1',
  title: 'My Note',
  isShared: false,
  updatedAt: new Date('2026-05-21T10:00:00Z'),
}

describe('NoteCard', () => {
  it('displays title and updatedAt', () => {
    render(<NoteCard note={note} />)
    expect(screen.getByText('My Note')).toBeInTheDocument()
    expect(screen.getByText(/may 21, 2026/i)).toBeInTheDocument()
  })

  it('shows Shared badge when isShared is true', () => {
    render(<NoteCard note={{ ...note, isShared: true }} />)
    expect(screen.getByText(/shared/i)).toBeInTheDocument()
  })

  it('does not show Shared badge when isShared is false', () => {
    render(<NoteCard note={note} />)
    expect(screen.queryByText(/shared/i)).not.toBeInTheDocument()
  })
})
