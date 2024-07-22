# h4b-dev/n1-vgs-components

h4b-dev/n1-vgs-components is a frontend library for VGS Collect that exposes a React component allowing users to securely create a tokenized credit card. This component ensures secure data collection and tokenization, making it easier to integrate VGS (Very Good Security) features into your React applications.

## Installation

To install the package, use npm or yarn:

```bash
npm install @h4b-dev/n1-vgs-components
# or
yarn add @h4b-dev/n1-vgs-components
```

## Usage

### Importing the Component

First, import the CollectForm component:

```jsx
import { CollectForm } from '@h4b-dev/n1-vgs-components'
```

### Importing the CSS

Next, import the required CSS files:

```jsx
import '@h4b-dev/n1-vgs-components/dist/assets/index.css'
```

### Using the Component

Finally, use the CollectForm component in your React application:

```jsx
function App() {
  return (
    <div className="new-card">
      <CollectForm
        token="<your-users-token>"
        environment="<your-env>"
        onSubmit={(id, httpStatus, httpResponse) => {
          // This will be null if the request is in error
          console.log('onSubmit:id', id)
          // Generally 200 or 400
          console.log('onSubmit:httpStatus', httpStatus)
          // Raw HTTP response from tokenization
          console.log('onSubmit:httpResponse', httpResponse)
        }}
        { /* optional properties:
        onUpdate={(state) => {
          console.log('onUpdate:state', state)
        }}
        onError={(errors) => {
          console.log('onError:errors', errors)
        }}
        */ }
      />
    </div>
  )
}
```

## Props

The CollectForm component accepts the following props:

- token (string, required): auth0 user token.
- environment (one of: [dev, sandbox, prod]): your environment. It will change the vault and vgs cname for the proxy.
- onSubmit (function, required): Callback function that is called when the form is submitted. It receives three arguments: id, httpStatus, and httpResponse.
- onUpdate (function, optional): Callback function that is called when the form state is updated. It receives one argument: state.
- onError (function, optional): Callback function that is called when there is an error. It receives one argument: errors.

Additionally, the texts for the label can be personalized with this prop:

```jsx
  localeLbl = {
    cardName: 'Nombre de la tarjeta',
    cardNumber: 'Número de tarjeta',
    cardExp: 'Vencimiento',
    cardCVV: 'CVV',
    formAction: 'Agregar tarjeta',
  }
```

## Development

To run the development environment for the library, checkout and use:

```bash
bun install
# then
bun run dev
```

## Deployment

A script is provided for ease of deploy, but it requires correctly configured access to the repository.

```bash
bun run deploy
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please read the CONTRIBUTING file for guidelines on how to contribute.

## Acknowledgements

    VGS Collect for providing secure data collection and tokenization services.
    React and Vite for making frontend development enjoyable and efficient.
