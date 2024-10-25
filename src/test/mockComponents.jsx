// src/test/mockComponents.jsx
import React from 'react'

export const mockVGSCollectState = {
  Name: { isValid: false },
  Number: { isValid: false, bin: '', last4: '', cardType: '' },
  ExpirationDate: { isValid: false },
  Cvv: { isValid: false }
}

// Create proper mock components
const createMockField = (testId) => 
  React.forwardRef((props, ref) => (
    <div data-testid={testId}>
      <input type="text" {...props} ref={ref} />
    </div>
  ))

export const MockTextField = createMockField('text-field')
export const MockCardNumberField = createMockField('card-number-field')
export const MockCardExpirationDateField = createMockField('card-expiration-field')
export const MockCardSecurityCodeField = createMockField('card-security-code-field')

export const MockVGSCollectForm = React.forwardRef(({ children, onSubmitCallback, onUpdateCallback }, ref) => {
  React.useEffect(() => {
    if (onUpdateCallback) {
      onUpdateCallback(mockVGSCollectState)
    }
  }, [onUpdateCallback])

  return (
    <form data-testid="vgs-form" ref={ref}>
      {children}
    </form>
  )
})

MockVGSCollectForm.displayName = 'VGSCollectForm'
