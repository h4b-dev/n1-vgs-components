# Implementation Manual for @h4b-dev/n1-vgs-components

This manual provides detailed instructions for developers who want to integrate the `@h4b-dev/n1-vgs-components` package into their applications. This guide assumes you are NOT cloning the repository but instead consuming it as an npm package.

## Table of Contents

1. [Installation](#installation)
2. [Styling](#styling)
3. [Basic Implementation](#basic-implementation)
4. [Creating a Card Form](#creating-a-card-form)
5. [Advanced Configuration](#advanced-configuration)
6. [Handling Events](#handling-events)
7. [Internationalization](#internationalization)
8. [Troubleshooting](#troubleshooting)

---

## Installation

### Using Bun

```bash
bun add @h4b-dev/n1-vgs-components
```

### Using npm

```bash
npm install @h4b-dev/n1-vgs-components
```

### Using pnpm

```bash
pnpm add @h4b-dev/n1-vgs-components
```

### Using Yarn

```bash
yarn add @h4b-dev/n1-vgs-components
```

---

## Styling

The component requires CSS files to render properly. Import the stylesheet in your application's entry point or in the component file where you use `CollectForm`:

```jsx
import '@h4b-dev/n1-vgs-components/dist/assets/index.css'
```

Ensure this import is executed before rendering the component.

---

## Basic Implementation

### Step 1: Import the Component

```jsx
import { CollectForm } from '@h4b-dev/n1-vgs-components'
import '@h4b-dev/n1-vgs-components/dist/assets/index.css'
```

### Step 2: Minimal Implementation

The simplest way to use the component:

```jsx
function MyCardForm() {
  const handleCardSubmit = (id, httpStatus, httpResponse) => {
    if (id) {
      console.log('Card created successfully with ID:', id)
      console.log('HTTP Status:', httpStatus)
      console.log('Response:', httpResponse)
    } else {
      console.log('Card creation failed')
      console.log('HTTP Status:', httpStatus)
    }
  }

  return (
    <CollectForm
      token="user-auth-token"
      environment="sandbox"
      onSubmit={handleCardSubmit}
    />
  )
}
```

---

## Creating a Card Form

### Complete Example with Error Handling

Here's a complete example of creating a card creation form with proper error handling and user feedback:

```jsx
import { useState } from 'react'
import { CollectForm } from '@h4b-dev/n1-vgs-components'
import '@h4b-dev/n1-vgs-components/dist/assets/index.css'

export function CardCreationForm({ userToken }) {
  const [isLoading, setIsLoading] = useState(false)
  const [cardCreated, setCardCreated] = useState(false)
  const [error, setError] = useState(null)
  const [cardInfo, setCardInfo] = useState(null)

  const handleCardSubmit = (cardId, httpStatus, httpResponse) => {
    setIsLoading(false)

    if (cardId) {
      // Success
      setCardInfo({
        id: cardId,
        lastFour: httpResponse?.data?.lastFour,
        brand: httpResponse?.data?.brand,
      })
      setCardCreated(true)
      setError(null)
    } else {
      // Failure
      const errorMessage =
        httpResponse?.message || 'Failed to create card. Please try again.'
      setError(errorMessage)
      setCardCreated(false)
    }
  }

  const handleFormUpdate = (state) => {
    // state contains validation status for each field
    // Useful for enabling/disabling submit button or showing field validation
    console.log('Form state:', state)
  }

  const handleFormError = (errors) => {
    console.error('Form errors:', errors)
    setError('There was an error with the form. Please check your input.')
  }

  if (cardCreated) {
    return (
      <div className="success-message">
        <h2>Card Added Successfully!</h2>
        <p>Card ID: {cardInfo.id}</p>
        <p>Brand: {cardInfo.brand}</p>
        <p>Last four: {cardInfo.lastFour}</p>
        <button onClick={() => setCardCreated(false)}>Add Another Card</button>
      </div>
    )
  }

  return (
    <div className="card-form-wrapper">
      <h2>Add a New Card</h2>

      {error && <div className="error-message">{error}</div>}

      <CollectForm
        token={userToken}
        environment="sandbox"
        onSubmit={handleCardSubmit}
        onUpdate={handleFormUpdate}
        onError={handleFormError}
      />
    </div>
  )
}
```

### Styling the Form

Add custom CSS to match your application's design:

```css
.card-form-wrapper {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
}

.card-form-wrapper h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
}

.success-message button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success-message button:hover {
  background-color: #218838;
}
```

---

## Advanced Configuration

### Component Props

The `CollectForm` component accepts the following props:

#### Required Props

- **`token`** (string): The authentication token for your user. This is typically an OAuth or JWT token that authorizes the card creation request. The token is sent in the `Authorization: Bearer ${token}` header.

- **`environment`** (string): One of `'dev'`, `'sandbox'`, or `'prod'`. This determines which VGS vault and proxy URL are used.
  - `'dev'`: Development environment for testing
  - `'sandbox'`: Sandbox environment (recommended for most development)
  - `'prod'`: Production environment (use with caution)

- **`onSubmit`** (function, required): Callback function triggered when the form is submitted.
  - Parameters:
    - `id` (string | null): The unique identifier of the created card, or null if creation failed
    - `httpStatus` (number): HTTP response status code (e.g., 200, 400, 500)
    - `httpResponse` (object): The complete HTTP response from the tokenization service
  - Example:
    ```jsx
    onSubmit={(id, httpStatus, httpResponse) => {
      if (id) {
        console.log('Card created:', id)
      }
    }}
    ```

#### Optional Props

- **`onUpdate`** (function): Called whenever the form state changes. Use this to track field validity.
  - Parameter: `state` - Object containing validation status for each field
  - Example:
    ```jsx
    onUpdate={(state) => {
      // state.Name.isValid
      // state.Number.isValid
      // state.ExpirationDate.isValid
      // state.Cvv.isValid
    }}
    ```

- **`onError`** (function): Called when an error occurs (e.g., VGS Collect script fails to load).
  - Parameter: `errors` - The error object or message
  - Example:
    ```jsx
    onError={(errors) => {
      console.error('Form error:', errors)
      // Handle the error appropriately
    }}
    ```

- **`validCardBrands`** (array): Array of card brands to accept. Default is `[{ type: 'visa' }, { type: 'mastercard' }]`.
  - Example for accepting American Express and Discover:
    ```jsx
    validCardBrands={[
      { type: 'visa' },
      { type: 'mastercard' },
      { type: 'amex' },
      { type: 'discover' },
    ]}
    ```

- **`localeLbl`** (object): Customize all form labels and button text. Default is Spanish labels.
  - Properties:
    - `cardName`: Label for cardholder name field
    - `cardNumber`: Label for card number field
    - `cardExp`: Label for expiration date field
    - `cardCVV`: Label for CVV field
    - `formAction`: Text for the submit button
  - Example (English):
    ```jsx
    localeLbl={{
      cardName: 'Cardholder Name',
      cardNumber: 'Card Number',
      cardExp: 'Expiration Date',
      cardCVV: 'Security Code',
      formAction: 'Add Card',
    }}
    ```

### Example with All Props

```jsx
<CollectForm
  token="user-jwt-token"
  environment="sandbox"
  onSubmit={(id, status, response) => {
    console.log('Card created:', id)
  }}
  onUpdate={(state) => {
    console.log('Form updated:', state)
  }}
  onError={(errors) => {
    console.error('Error:', errors)
  }}
  validCardBrands={[
    { type: 'visa' },
    { type: 'mastercard' },
    { type: 'amex' },
  ]}
  localeLbl={{
    cardName: 'Full Name on Card',
    cardNumber: 'Card Number',
    cardExp: 'MM/YY',
    cardCVV: 'CVV',
    formAction: 'Create Card',
  }}
/>
```

---

## Handling Events

### Understanding the onSubmit Callback

The `onSubmit` callback receives three parameters that give you complete control over handling the card creation response:

```jsx
const handleSubmit = (id, httpStatus, httpResponse) => {
  // id: string or null
  //   - If not null: the unique identifier of the created card
  //   - If null: card creation failed

  // httpStatus: number
  //   - 200: Card created successfully
  //   - 400: Bad request (validation error)
  //   - 401/403: Authorization error
  //   - 500: Server error

  // httpResponse: object
  //   - Contains the full API response including metadata
  //   - Example: { data: { id: '...', lastFour: '4242', brand: 'visa' } }
}
```

### Common Response Patterns

**Successful Creation (HTTP 200)**
```javascript
id: 'card_abc123xyz789'
httpStatus: 200
httpResponse: {
  data: {
    id: 'card_abc123xyz789',
    lastFour: '4242',
    brand: 'visa',
    bin: '424242',
  }
}
```

**Validation Error (HTTP 400)**
```javascript
id: null
httpStatus: 400
httpResponse: {
  message: 'Card number is invalid',
  errors: [/* validation errors */]
}
```

---

## Internationalization

### Setting Different Languages

The component is designed to be flexible with labels. Here are examples for common languages:

#### English
```jsx
<CollectForm
  localeLbl={{
    cardName: 'Cardholder Name',
    cardNumber: 'Card Number',
    cardExp: 'Expiration Date',
    cardCVV: 'Security Code',
    formAction: 'Add Card',
  }}
  // ... other props
/>
```

#### Spanish (Default)
```jsx
<CollectForm
  localeLbl={{
    cardName: 'Nombre en la tarjeta',
    cardNumber: 'Número de tarjeta',
    cardExp: 'Vencimiento',
    cardCVV: 'CVV',
    formAction: 'Agregar tarjeta',
  }}
  // ... other props
/>
```

#### French
```jsx
<CollectForm
  localeLbl={{
    cardName: 'Nom du titulaire',
    cardNumber: 'Numéro de carte',
    cardExp: 'Date d\'expiration',
    cardCVV: 'Code de sécurité',
    formAction: 'Ajouter une carte',
  }}
  // ... other props
/>
```

#### Portuguese
```jsx
<CollectForm
  localeLbl={{
    cardName: 'Nome do Titular',
    cardNumber: 'Número do Cartão',
    cardExp: 'Data de Validade',
    cardCVV: 'Código de Segurança',
    formAction: 'Adicionar Cartão',
  }}
  // ... other props
/>
```

### Dynamic Language Selection

```jsx
function CardForm({ userLanguage, userToken }) {
  const labels = {
    en: {
      cardName: 'Cardholder Name',
      cardNumber: 'Card Number',
      cardExp: 'Expiration Date',
      cardCVV: 'Security Code',
      formAction: 'Add Card',
    },
    es: {
      cardName: 'Nombre en la tarjeta',
      cardNumber: 'Número de tarjeta',
      cardExp: 'Vencimiento',
      cardCVV: 'CVV',
      formAction: 'Agregar tarjeta',
    },
    fr: {
      cardName: 'Nom du titulaire',
      cardNumber: 'Numéro de carte',
      cardExp: 'Date d\'expiration',
      cardCVV: 'Code de sécurité',
      formAction: 'Ajouter une carte',
    },
  }

  return (
    <CollectForm
      token={userToken}
      environment="sandbox"
      localeLbl={labels[userLanguage] || labels.en}
      onSubmit={(id, status, response) => {
        // Handle submission
      }}
    />
  )
}
```

---

## Troubleshooting

### Issue: "CollectForm is not defined"

**Solution**: Ensure you've imported the component correctly:
```jsx
import { CollectForm } from '@h4b-dev/n1-vgs-components'
```

### Issue: Styles not applying

**Solution**: Make sure the CSS file is imported:
```jsx
import '@h4b-dev/n1-vgs-components/dist/assets/index.css'
```

Import this at the top of your application or in the component file itself. If using a bundler like Vite or Webpack, ensure it's configured to handle CSS imports from node_modules.

### Issue: "Invalid token" errors in onSubmit

**Solution**: Verify that your token is:
- Valid and not expired
- Properly formatted
- Passed to the component before initialization
- A real user token (not a test/dummy string)

### Issue: VGS Collect script fails to load

**Solution**:
- Check your environment configuration. Ensure `environment` is one of: `'dev'`, `'sandbox'`, or `'prod'`
- Verify that your network allows loading external scripts from VGS domains
- Check the `onError` callback for detailed error information
- Try a different environment to isolate the issue

### Issue: Form submission is disabled (button is grayed out)

**Solution**: The submit button is disabled until all fields are valid. Ensure:
- Cardholder name is not empty
- Card number is a valid credit card number (Luhn algorithm check)
- Expiration date is in the future and in valid format (MM/YY)
- CVV is 3-4 digits

### Issue: Card not created but no error in onSubmit

**Solution**: Check the HTTP response in the `onSubmit` callback:
```jsx
onSubmit={(id, status, response) => {
  console.log('ID:', id)
  console.log('Status:', status)
  console.log('Response:', response)
  // Inspect the response to see what went wrong
}}
```

---

## Best Practices

1. **Always handle errors**: Implement the `onError` callback to handle script loading failures.

2. **Secure token handling**: Never hardcode tokens in your frontend code. Fetch tokens from your backend.

3. **Provide user feedback**: Use the `onSubmit` callback to show success/error messages.

4. **Test in sandbox first**: Always test card creation in the sandbox environment before moving to production.

5. **Validate on both ends**: While the component provides client-side validation, always validate card data on your backend as well.

6. **Use appropriate card brands**: Configure `validCardBrands` to only accept cards your business supports.

7. **Accessible labels**: Customize `localeLbl` to match your application's language and terminology.

8. **Handle loading states**: Display loading indicators while the card is being created to prevent duplicate submissions.
