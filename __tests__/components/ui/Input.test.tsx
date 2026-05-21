import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../../../components/ui/Input'

describe('Input', () => {
  it('renders with value', () => {
    render(<Input id="test" name="test" defaultValue="hello" />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Input id="test" name="test" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })
})
