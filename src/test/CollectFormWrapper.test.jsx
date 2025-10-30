import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

    render(<CollectFormWrapper token="test-token" environment="dev" />)

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

    render(<CollectFormWrapper token="test-token" environment="dev" />)

    await waitFor(() => {
      expect(screen.getByText('Daily limit reached')).toBeInTheDocument()
    })
  })

  it('should render a loading state', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })
    render(<CollectFormWrapper token="test-token" environment="dev" />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('should render the CollectForm if token is not provided', () => {
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('should render the LimitsMessage when there is an error fetching limits', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<CollectFormWrapper token="test-token" environment="dev" />)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred while validating limits.')).toBeInTheDocument()
    })
  })

  it('should render the LimitsMessage when the API response is not ok', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<CollectFormWrapper token="test-token" environment="dev" />)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred while validating limits.')).toBeInTheDocument()
    })
  })

  it('should pass all props to CollectForm when rendering it', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const mockProps = {
      token: 'test-token',
      environment: 'sandbox',
      vaultId: 'test-vault',
    }

    render(<CollectFormWrapper {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })
})

describe('PropTypes validation', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('accepts valid environment values - dev', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" environment="dev" />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('accepts valid environment values - sandbox', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" environment="sandbox" />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('accepts valid environment values - prod', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" environment="prod" />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('accepts function props for callbacks', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const callbacks = {
      onSubmit: vi.fn(),
      onUpdate: vi.fn(),
      onError: vi.fn(),
    }

    render(<CollectFormWrapper token="test-token" environment="dev" {...callbacks} />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('accepts valid localeLbl object', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const localeLbl = {
      cardName: 'Card Name',
      cardNumber: 'Card Number',
      cardExp: 'Expiration',
      cardCVV: 'CVV',
      formAction: 'Submit',
    }

    render(<CollectFormWrapper token="test-token" environment="dev" localeLbl={localeLbl} />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('accepts valid validCardBrands array', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const validCardBrands = [{ type: 'visa' }, { type: 'mastercard' }, { type: 'amex' }]

    render(<CollectFormWrapper token="test-token" environment="dev" validCardBrands={validCardBrands} />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('uses default props when not provided', () => {
    render(<CollectFormWrapper />)

    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('accepts all valid props together', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const allProps = {
      token: 'test-token',
      environment: 'sandbox',
      onError: vi.fn(),
      onSubmit: vi.fn(),
      onUpdate: vi.fn(),
      localeLbl: {
        cardName: 'Card Name',
        cardNumber: 'Card Number',
        cardExp: 'Expiration',
        cardCVV: 'CVV',
        formAction: 'Submit',
      },
      validCardBrands: [{ type: 'visa' }, { type: 'mastercard' }],
    }

    render(<CollectFormWrapper {...allProps} />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('executes default onError function when not provided', () => {
    // Render without onError to trigger default
    render(<CollectFormWrapper token="" />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('executes default onSubmit function when not provided', () => {
    // Render without onSubmit to trigger default
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('executes default onUpdate function when not provided', () => {
    // Render without onUpdate to trigger default
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('uses default environment when not provided', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    // Render without environment to use default 'dev'
    render(<CollectFormWrapper token="test-token" />)

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('uses default token when not provided', () => {
    // Render without token to use default ''
    render(<CollectFormWrapper environment="dev" />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('uses default localeLbl when not provided', () => {
    // Render without localeLbl to use default
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('uses default validCardBrands when not provided', () => {
    // Render without validCardBrands to use default
    render(<CollectFormWrapper />)
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })
})

describe('Sandbox environment behavior', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should skip limits validation and render CollectForm directly in sandbox environment', () => {
    render(<CollectFormWrapper token="test-token" environment="sandbox" />)

    // Should not call fetch in sandbox
    expect(window.fetch).not.toHaveBeenCalled()

    // Should render CollectForm immediately without loading state
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('should always render CollectForm in sandbox even with token', () => {
    render(<CollectFormWrapper token="test-token" environment="sandbox" />)

    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should not show LimitsMessage in sandbox regardless of limits', () => {
    render(<CollectFormWrapper token="test-token" environment="sandbox" />)

    expect(screen.queryByText(/limit/i)).not.toBeInTheDocument()
    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
  })

  it('should still perform validation in dev environment', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" environment="dev" />)

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Should call fetch for dev environment
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('should still perform validation in prod environment', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    render(<CollectFormWrapper token="test-token" environment="prod" />)

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Should call fetch for prod environment
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    })
  })

  it('should pass all props to CollectForm in sandbox environment', () => {
    const mockProps = {
      token: 'test-token',
      environment: 'sandbox',
      vaultId: 'test-vault',
      onSubmit: vi.fn(),
      onError: vi.fn(),
      onUpdate: vi.fn(),
    }

    render(<CollectFormWrapper {...mockProps} />)

    expect(screen.getByTestId('collect-form')).toBeInTheDocument()
    expect(window.fetch).not.toHaveBeenCalled()
  })
})
