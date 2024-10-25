// src/components/CollectForm/CollectForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { loadVGSCollect } from '@vgs/collect-js'
import { useVGSCollectState } from '@vgs/collect-js-react'
import CollectForm from './CollectForm'

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

