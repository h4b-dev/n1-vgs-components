// src/components/CollectForm/CollectForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { loadVGSCollect } from '@vgs/collect-js'
import { useVGSCollectState } from '@vgs/collect-js-react'
import CollectForm from './CollectForm'
import { onSubmitCallback, onUpdateCallback, onErrorCallback } from './CollectForm'
import { formatSubmitData } from './CollectForm'

const mockProps = {
  token: 'test-token',
  environment: 'dev',
  onSubmit: vi.fn(),
  onUpdate: vi.fn(),
  onError: vi.fn(),
}

describe('CollectForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', async () => {
    render(<CollectForm {...mockProps} />)

    // Wait for all elements to be available
    await waitFor(() => {
      expect(screen.getByTestId('vgs-form')).toBeInTheDocument()
      expect(screen.getByTestId('text-field')).toBeInTheDocument()
      expect(screen.getByTestId('card-number-field')).toBeInTheDocument()
      expect(screen.getByTestId('card-expiration-field')).toBeInTheDocument()
      expect(screen.getByTestId('card-security-code-field')).toBeInTheDocument()
    })
  })

  it('loads VGS Collect script on mount', async () => {
    render(<CollectForm {...mockProps} />)

    await waitFor(() => {
      expect(loadVGSCollect).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onError if VGS Collect script fails to load', async () => {
    const error = new Error('Failed to load')
    vi.mocked(loadVGSCollect).mockRejectedValueOnce(error)

    render(<CollectForm {...mockProps} />)

    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalledWith(error)
    })
  })

  it('disables submit button when form is invalid', async () => {
    render(<CollectForm {...mockProps} />)

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /agregar tarjeta/i })
      expect(submitButton).toBeDisabled()
    })
  })

  it('enables submit button when form becomes valid', async () => {
    vi.mocked(useVGSCollectState).mockReturnValue([
      {
        Name: { isValid: true },
        Number: { isValid: true, bin: '123456', last4: '4242', cardType: 'visa' },
        ExpirationDate: { isValid: true },
        Cvv: { isValid: true },
      },
    ])

    render(<CollectForm {...mockProps} />)

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /agregar tarjeta/i })
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('calls onUpdate with form state changes', async () => {
    render(<CollectForm {...mockProps} />)

    await waitFor(() => {
      expect(mockProps.onUpdate).toHaveBeenCalledWith({
        Name: { isValid: false },
        Number: { isValid: false, bin: '', last4: '', cardType: '' },
        ExpirationDate: { isValid: false },
        Cvv: { isValid: false },
      })
    })
  })

  it('renders with custom locale labels', async () => {
    const customLabels = {
      cardName: 'Custom Name',
      cardNumber: 'Custom Number',
      cardExp: 'Custom Exp',
      cardCVV: 'Custom CVV',
      formAction: 'Custom Submit',
    }

    render(<CollectForm {...mockProps} localeLbl={customLabels} />)

    await waitFor(() => {
      expect(screen.getByText(customLabels.cardName)).toBeInTheDocument()
      expect(screen.getByText(customLabels.cardNumber)).toBeInTheDocument()
      expect(screen.getByText(customLabels.cardExp)).toBeInTheDocument()
      expect(screen.getByText(customLabels.cardCVV)).toBeInTheDocument()
      expect(screen.getByText(customLabels.formAction)).toBeInTheDocument()
    })
  })
})

describe('Callback functions', () => {
  it('onSubmitCallback handles successful submission', () => {
    const setIsFormLoading = vi.fn()
    const onSubmit = vi.fn()
    const status = 'success'
    const response = { data: { id: '123' } }

    onSubmitCallback(setIsFormLoading, onSubmit)(status, response)

    expect(setIsFormLoading).toHaveBeenCalledWith(false)
    expect(onSubmit).toHaveBeenCalledWith('123', status, response)
  })

  it('onSubmitCallback handles submission without id', () => {
    const setIsFormLoading = vi.fn()
    const onSubmit = vi.fn()
    const status = 'success'
    const response = { data: {} }

    onSubmitCallback(setIsFormLoading, onSubmit)(status, response)

    expect(setIsFormLoading).toHaveBeenCalledWith(false)
    expect(onSubmit).toHaveBeenCalledWith(null, status, response)
  })

  it('onUpdateCallback calls onUpdate with state', () => {
    const onUpdate = vi.fn()
    const state = { field1: { isValid: true }, field2: { isValid: false } }

    onUpdateCallback(onUpdate)(state)

    expect(onUpdate).toHaveBeenCalledWith(state)
  })

  it('onErrorCallback calls onError with errors', () => {
    const onError = vi.fn()
    const errors = [{ field: 'cardNumber', message: 'Invalid card number' }]

    onErrorCallback(onError)(errors)

    expect(onError).toHaveBeenCalledWith(errors)
  })
})

describe('Form submission', () => {
  it('disables submit button during form submission', async () => {
    render(<CollectForm {...mockProps} />)

    // First, we need to make the form valid
    vi.mocked(useVGSCollectState).mockReturnValue([
      {
        Name: { isValid: true },
        Number: { isValid: true, bin: '123456', last4: '4242', cardType: 'visa' },
        ExpirationDate: { isValid: true },
        Cvv: { isValid: true },
      },
    ])

    // Wait for the form to be rendered and become valid
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /agregar tarjeta/i })
      expect(submitButton).not.toBeDisabled()
    })

    // Trigger form submission
    const form = screen.getByTestId('vgs-form')
    fireEvent.submit(form)

    // Check if the button is disabled after submission
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /agregar tarjeta/i })
      expect(submitButton).toBeDisabled()
    })
  })
})

describe('Environment configuration', () => {
  it('uses correct environment configuration', async () => {
    const envProps = {
      ...mockProps,
      environment: 'sandbox',
    }

    render(<CollectForm {...envProps} />)

    await waitFor(() => {
      expect(loadVGSCollect).toHaveBeenCalledWith(expect.objectContaining({
        vaultId: import.meta.env.VITE_VGS_SANDBOX_VAULT_ID,
        environment: import.meta.env.VITE_VGS_SANDBOX_ENVIRONMENT,
        cname: import.meta.env.VITE_VGS_SANDBOX_CNAME,
        version: String(import.meta.env.VITE_VGS_COLLECT_VERSION),
      }))
    })
  })
})

describe('formatSubmitData', () => {
  it('formats submit data correctly', () => {
    const fields = {
      Name: 'John Doe',
      Number: '4111111111111111',
      ExpirationDate: '12/24',
      Cvv: '123',
    }
    const state = {
      Number: {
        bin: '411111',
        last4: '1111',
        cardType: 'visa',
      },
    }

    const result = formatSubmitData(fields, state)

    expect(result).toEqual({
      Name: 'John Doe',
      Number: '4111111111111111',
      BinNumber: '411111',
      LastFour: '1111',
      ExpirationDate: '12/24',
      Cvv: '123',
      Brand: 'visa',
      Enabled: true,
      Blocked: false,
    })
  })

  it('handles missing fields gracefully', () => {
    const fields = {}
    const state = {
      Number: {},
    }

    const result = formatSubmitData(fields, state)

    expect(result).toEqual({
      Name: undefined,
      Number: undefined,
      BinNumber: undefined,
      LastFour: undefined,
      ExpirationDate: undefined,
      Cvv: undefined,
      Brand: undefined,
      Enabled: true,
      Blocked: false,
    })
  })
})
