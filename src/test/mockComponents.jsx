// src/test/mockComponents.jsx
import React from 'react'
import { mockVGSCollectState } from './mockData'

// Create proper mock components
const createMockField = (testId, displayName) => {
  const MockField = React.forwardRef((props, ref) => (
    <div data-testid={testId}>
      <input type="text" {...props} ref={ref} />
    </div>
  ))
  MockField.displayName = displayName
  return MockField
}

export const MockTextField = createMockField('text-field', 'MockTextField')
export const MockCardNumberField = createMockField('card-number-field', 'MockCardNumberField')
export const MockCardExpirationDateField = createMockField('card-expiration-field')
export const MockCardSecurityCodeField = createMockField('card-security-code-field')

export const MockVGSCollectForm = React.forwardRef(({ children, onUpdateCallback }, ref) => {
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
