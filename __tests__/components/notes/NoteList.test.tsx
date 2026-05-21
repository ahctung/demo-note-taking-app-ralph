import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NoteList from '../../../components/notes/NoteList'

const notes = [
  { id: '1', title: 'First Note', isShared: false, updatedAt: new Date() },
  { id: '2', title: 'Second Note', isShared: true, updatedAt: new Date() },
]

describe('NoteList', () => {
  it('renders a NoteCard for each note', () => {
    render(<NoteList notes={notes} />)
    expect(screen.getByText('First Note')).toBeInTheDocument()
    expect(screen.getByText('Second Note')).toBeInTheDocument()
  })
})
