
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import CollectFormWrapper from '../../src/components/CollectFormWrapper'

vi.mock('../../src/components/CollectForm', () => ({
  __esModule: true,
  default: () => <div data-testid="collect-form">Collect Form</div>,
}))

describe('CollectFormWrapper', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the CollectForm when canCreate is true', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" limitsApiUrl="/api/limits" />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('should render the LimitsMessage when canCreate is false', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        limits: {
          allowed: {
            canCreateNewCard: false,
            reasonMessage: 'Daily limit reached',
          },
        },
      }),
    })

    render(<CollectFormWrapper token="test-token" limitsApiUrl="/api/limits" />)

    await waitFor(() => {
      expect(screen.getByText('Daily limit reached')).toBeInTheDocument()
    })
  })

  it('should render a loading state', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })
    render(<CollectFormWrapper token="test-token" limitsApiUrl="/api/limits" />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('should render the CollectForm if token and limitsApiUrl are not provided', () => {
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })
})
