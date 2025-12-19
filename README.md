# h4b-dev/n1-vgs-components

h4b-dev/n1-vgs-components is a frontend library for VGS Collect that exposes a React component allowing users to securely create a tokenized credit card. This component ensures secure data collection and tokenization, making it easier to integrate VGS (Very Good Security) features into your React applications.

## Quick Links

- **Using this package?** → See [MANUAL.md](./MANUAL.md) for implementation instructions
- **Contributing to development?** → See sections below for development setup
- **Using Claude Code?** → See [CLAUDE.md](./CLAUDE.md) for Claude-specific guidance
- **Using Gemini?** → See [GEMINI.md](./GEMINI.md) for Gemini-specific guidance

## Package Overview

This package provides a single, production-ready React component (`CollectForm`) that:

- Securely collects credit card information using VGS Collect
- Validates card data on the client side
- Tokenizes card information before transmission
- Supports multiple card brands (Visa, Mastercard, Amex, Discover, etc.)
- Provides comprehensive internationalization with customizable labels
- Works with three environments: dev, sandbox, and production

## Installation (for consumers)

To install the package in your application:

```bash
npm install @h4b-dev/n1-vgs-components
# or yarn add @h4b-dev/n1-vgs-components
# or pnpm add @h4b-dev/n1-vgs-components
# or bun add @h4b-dev/n1-vgs-components
```

See [MANUAL.md](./MANUAL.md) for detailed usage instructions.

## Development Setup

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Git
- GitHub SSH access (for deployment)

### Installation

```bash
bun install
```

### Development Environment

Run the interactive component development environment:

```bash
bun run dev
```

This starts Ladle, a component development and documentation tool, at `http://localhost:61000`.

### Project Structure

```
src/
├── index.js                          # Main export
├── global.css                        # Global styles
├── components/
│   ├── CollectForm/
│   │   ├── CollectForm.jsx          # Main component implementation
│   │   ├── CollectForm.module.css   # Component styles
│   │   ├── CollectForm.stories.jsx  # Component documentation (Ladle)
│   │   └── index.js                 # Export
│   ├── CollectFormWrapper/
│   │   ├── CollectFormWrapper.jsx   # Higher-order wrapper
│   │   └── index.js                 # Export
│   ├── LimitsMessage/
│   │   ├── LimitsMessage.jsx        # Limits validation display
│   │   └── index.js                 # Export
│   └── index.js                     # Component barrel export
└── hooks/
    └── useLimitsValidation.js       # Custom validation hook
```

### Key Files for Developers

- **src/components/CollectForm/CollectForm.jsx**: Core component implementation with VGS integration
- **src/components/CollectFormWrapper/CollectFormWrapper.jsx**: Wrapper that handles VGS Collect script loading
- **vite.config.js**: Build configuration (library mode, external dependencies)
- **vitest.config.js**: Test runner configuration
- **package.json**: Dependencies, scripts, and publish configuration

## Building

Build the library for distribution:

```bash
bun run build
```

This generates:
- `dist/index.js`: ES module output
- `dist/assets/index.css`: Bundled styles
- `dist/assets/index-*.css`: CSS modules for each component

The build uses Vite with the following configuration:
- **Output format**: ES module only
- **External dependencies**: React and ReactDOM are marked as external (consumers must provide these)
- **CSS splitting**: Enabled for optimal code splitting
- **Asset naming**: Clean asset file names for easier consumption

## Testing

Run tests with npm (required due to vitest configuration):

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests are located in `src/test/` and use Vitest with React Testing Library.

### Key Test Files

- **CollectForm.test.jsx**: Component rendering and callback tests
- **CollectFormWrapper.test.jsx**: VGS script loading and initialization tests
- **LimitsMessage.test.jsx**: Validation message display tests
- **useLimitsValidation.test.jsx**: Custom hook tests

## Code Quality

### Linting

```bash
bun run lint
```

This runs ESLint with the following rules enabled:
- React and React Hooks best practices
- Import organization
- Prettier formatting compatibility

### Configuration Files

- **.eslintrc.cjs**: ESLint configuration with React plugins
- **.prettierrc**: Prettier configuration for consistent formatting
- **postcss.config.js**: PostCSS configuration for CSS processing

## Deployment

The package is published to the GitHub npm registry (`npm.pkg.github.com`).

### Deploying to npm Registry

```bash
bun run deploy
```

This script:
1. Installs dependencies
2. Removes bundled React/ReactDOM to keep bundle size small
3. Builds the distribution files
4. Publishes to the GitHub npm registry

**Prerequisites:**
- Configured GitHub credentials in `~/.npmrc` or environment
- Update version in `package.json` before deployment
- Git commit and push access to the repository

### Version Management

Update the version in `package.json` following semantic versioning:

```json
{
  "version": "MAJOR.MINOR.PATCH"
}
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Environment Configuration

VGS environment and vault configuration is stored in `.env.production` and read at build time:

```env
# Development vault (sandbox)
VITE_VGS_DEV_VAULT_ID=tnt0sclu1hb
VITE_VGS_DEV_ENVIRONMENT=sandbox
VITE_VGS_DEV_CNAME=tokenization-proxy.h4b.dev

# Sandbox vault
VITE_VGS_SANDBOX_VAULT_ID=tntuskaycen
VITE_VGS_SANDBOX_ENVIRONMENT=sandbox
VITE_VGS_SANDBOX_CNAME=proxy-payment-methods-sandbox.n1co.com

# Production vault
VITE_VGS_PROD_VAULT_ID=tntijvx4w31
VITE_VGS_PROD_ENVIRONMENT=live
VITE_VGS_PROD_CNAME=proxy-payment-methods.n1co.com

# VGS settings
VITE_VGS_COLLECT_VERSION=2.24.6
VITE_VGS_CREATE_ACTION=/api/cards
VITE_VGS_CHECK_ACTION=/api/profiles
```

Do not commit sensitive data to version control. Update vault credentials in your CI/CD pipeline.

## Dependencies

### Core Dependencies

- **@vgs/collect-js** (0.7.2): VGS Collect JavaScript library
- **@vgs/collect-js-react** (2.0.0): React bindings for VGS Collect

### Peer Dependencies

- **react** (19.1.1): React library (must be installed by consumers)
- **react-dom** (19.1.1): React DOM (must be installed by consumers)

### Dev Dependencies

Key development dependencies:
- **@vitejs/plugin-react-swc**: Vite plugin for React with SWC compiler
- **vitest**: Fast unit test framework
- **@testing-library/react**: React component testing utilities
- **ladle**: Component development and documentation tool
- **eslint**: Code quality tool
- **prettier**: Code formatter

## Contributing

Contributions are welcome! When contributing:

1. Create a feature branch from `main`
2. Make your changes and run tests
3. Run `bun run lint` to check code quality
4. Create a pull request with clear description
5. Ensure all tests pass

## Architecture Notes

### Component Hierarchy

```
CollectFormWrapper (handles VGS script loading)
└── CollectForm (main form component)
    └── VGSCollectForm (from @vgs/collect-js-react)
        ├── TextField (cardholder name)
        ├── CardNumberField (card number)
        └── CardExpirationDateField + CardSecurityCodeField (in row)
```

### Key Design Decisions

1. **VGS Collect dependency**: Uses official VGS libraries for security compliance
2. **CSS Modules**: Component styles are scoped to prevent conflicts
3. **Customizable labels**: All user-facing text is configurable for i18n
4. **Callback-based events**: No state management library dependency, pure React patterns
5. **External React**: React is external to keep bundle size minimal

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- VGS Collect for providing secure data collection and tokenization services
- React and Vite for making frontend development enjoyable and efficient
