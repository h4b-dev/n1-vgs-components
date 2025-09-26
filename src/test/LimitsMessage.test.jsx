
import React from 'react'
import { render, screen } from '@testing-library/react'
import LimitsMessage from '../../src/components/LimitsMessage'

describe('LimitsMessage', () => {
  it('should render the message', () => {
    render(<LimitsMessage message="Test message" />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })
})
