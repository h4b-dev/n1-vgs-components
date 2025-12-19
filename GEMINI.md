# Google Gemini Integration Guide for n1-vgs-components

This guide is designed for developers using Google's Gemini AI (Claude's alternative) to work on or with the `@h4b-dev/n1-vgs-components` package.

## Quick Start with Gemini

### Getting Gemini to understand this project

You can ask Gemini questions about the codebase. To help Gemini understand the project better, you may need to:

1. **Share key files**: Copy and paste important files into the chat
2. **Describe the structure**: Explain the project layout
3. **Provide context**: Share relevant README or documentation

Example prompts:

```
"I have a React component library for VGS Collect card tokenization. Here's the main component [paste CollectForm.jsx]... Can you help me understand how it works?"

"I need to add Amex and Discover support to this card form component. Here's the current card brand configuration..."

"This is our testing setup [paste test file]... How would you write a test for..."
```

## Working with Gemini on This Project

### Setting Up Context

Since Gemini may not have automatic repository understanding, provide context by sharing:

1. **Project Structure Overview**:
```
src/
├── components/
│   ├── CollectForm/             # Main card collection form
│   ├── CollectFormWrapper/       # VGS script loader wrapper
│   └── LimitsMessage/            # Validation display
├── hooks/
│   └── useLimitsValidation.js    # Custom validation hook
└── index.js                      # Main export
```

2. **Key Dependencies**:
```json
{
  "@vgs/collect-js": "0.7.2",
  "@vgs/collect-js-react": "2.0.0",
  "react": "19.1.1",
  "react-dom": "19.1.1"
}
```

3. **Package Purpose**: A React component that securely tokenizes credit cards using VGS Collect

### Asking About Functionality

When asking Gemini about specific functionality, include relevant code:

```
"Here's our CollectForm component [paste code]. How can we add support for card expiration date validation?"

"I have this error callback [paste code]. Why might the VGS script fail to load and how should we handle it?"

"Can you explain this submit flow [paste code snippet]? How does it interact with VGS?"
```

## Gemini Workflows for Development

### Workflow 1: Code Review and Optimization

**Step 1**: Share your code
```
"Here's my implementation [paste CollectForm.jsx]. Can you review it for:"
- Security issues (especially around token handling)
- Performance optimizations
- React best practices
- Accessibility improvements
```

**Step 2**: Ask for improvements
```
"What's the best way to handle the onError callback?"
"Are there any memory leaks in this component?"
"How can we improve the form validation UX?"
```

### Workflow 2: Adding New Features

**Step 1**: Describe what you want
```
"I need to add support for multiple card brands. Here's the current brand configuration [paste]. What's the best approach?"
```

**Step 2**: Share current code
```
"Here's how we currently validate the card number [paste CardNumberField code]. How should I extend this for new brands?"
```

**Step 3**: Get implementation help
```
"Can you show me how to add Amex support while following the existing patterns?"
```

### Workflow 3: Bug Investigation

**Step 1**: Describe the problem
```
"The form isn't resetting after submission. Here's the submit handler [paste onSubmit callback]..."
```

**Step 2**: Share relevant code
```
"Here's the entire component [paste CollectForm.jsx]... Where do you think the issue is?"
```

**Step 3**: Ask for solutions
```
"How would you fix this? Should we use useEffect or a different approach?"
```

### Workflow 4: Writing Tests

**Step 1**: Share the component
```
"Here's the component I need to test [paste component code]..."
```

**Step 2**: Ask for test patterns
```
"What's the best way to test the VGS script loading in the wrapper component?"
"How do I mock the VGS Collect callbacks?"
```

**Step 3**: Get test implementation
```
"Can you write a test that verifies the form handles submission errors correctly?"
```

## Key Components to Understand

When working with Gemini, make sure to explain these key components:

### CollectForm Component
- **Purpose**: Renders the actual card form with VGS fields
- **Props**: token, environment, onSubmit, onUpdate, onError, localeLbl, validCardBrands
- **Key Features**:
  - Custom labels support (for i18n)
  - Multiple card brand support
  - Real-time validation
  - Secure tokenization through VGS

### CollectFormWrapper Component
- **Purpose**: Handles VGS Collect script loading
- **Responsibility**: Ensures VGS script is loaded before rendering form
- **Error Handling**: Catches script loading failures

### Environment Configuration
Three environments with different VGS vaults:
- **dev**: Development environment for testing
- **sandbox**: Staging environment
- **prod**: Production environment

## Example: Explaining the Architecture to Gemini

```
"This is a React component library that integrates with VGS Collect for secure credit card tokenization.

The architecture is:
1. CollectFormWrapper loads the VGS Collect script asynchronously
2. Once loaded, it renders CollectForm
3. CollectForm uses the VGS React components (TextField, CardNumberField, etc.)
4. When user submits, card data is tokenized by VGS
5. The token is sent to our backend via the onSubmit callback

Key security aspect: Card data never touches our JavaScript - VGS handles everything.

Here's the component [paste code]... Can you help me..."
```

## VGS Collect Integration Specifics

When asking about VGS integration, explain:

### How Tokenization Works
1. User enters card details in form fields
2. VGS Collect validates the card format
3. Form submission tokenizes the data
4. Tokenized data is sent to your API
5. Token is returned and stored

### Security Model
- Card data never accessible to your JavaScript
- VGS Collect handles all PCI compliance
- Your backend exchanges token for actual card data
- Tokens are short-lived and environment-specific

### Configuration Example
```javascript
const ENV_CONFIG = {
  dev: {
    vaultId: 'dev-vault-id',
    environment: 'sandbox',
    cname: 'tokenization-proxy.h4b.dev',
  },
  sandbox: {
    vaultId: 'sandbox-vault-id',
    environment: 'sandbox',
    cname: 'proxy-payment-methods-sandbox.n1co.com',
  },
  prod: {
    vaultId: 'prod-vault-id',
    environment: 'live',
    cname: 'proxy-payment-methods.n1co.com',
  },
}
```

## Common Questions to Ask Gemini

### About Implementation
```
"How would you implement [feature]?"
"What's the best React pattern for [use case]?"
"Should we use [approach A] or [approach B]?"
"Is this component accessible for screen readers?"
```

### About Security
```
"Are there any security vulnerabilities in this code [paste]?"
"How should we handle the authentication token?"
"What validation should happen client-side vs server-side?"
"Is the error handling secure (not leaking sensitive data)?"
```

### About Performance
```
"How can we optimize the bundle size?"
"Are there unnecessary re-renders in this component?"
"Should we lazy-load the VGS script?"
"What's the performance impact of CSS modules here?"
```

### About Testing
```
"How do we test asynchronous script loading?"
"What's the best way to mock VGS Collect?"
"How do we test form validation?"
"Should we test the component hierarchy or use integration tests?"
```

### About Internationalization
```
"How do we handle RTL languages?"
"Should we support more label customization?"
"What's the best way to manage translations at scale?"
```

## Sharing Code with Gemini

### Do's
- ✅ Share complete files for context
- ✅ Include imports and dependencies
- ✅ Provide surrounding code for functions
- ✅ Explain what the code does and what you want

### Don'ts
- ❌ Only share code snippets without context
- ❌ Ask questions without providing relevant code
- ❌ Expect Gemini to remember previous conversations (start fresh with context)
- ❌ Assume Gemini knows the project structure

## Example Conversation Starter

```
"I'm working on a React component library called n1-vgs-components that handles secure credit card tokenization using VGS Collect.

The main component is CollectForm, which accepts:
- token (JWT for authentication)
- environment ('dev', 'sandbox', or 'prod')
- onSubmit callback for handling the tokenized card
- onError callback for error handling
- localeLbl for customizing all text labels
- validCardBrands for controlling accepted card types

Here's the current implementation:
[paste CollectForm.jsx]

I want to [describe what you want to do]. Can you help me with [specific question]?"
```

## Documenting Your Changes

After Gemini helps you with changes, ask:

```
"Can you explain the changes you made in simple terms?"
"What's the impact of this change on performance/security/UX?"
"Do I need to update any tests or documentation?"
"Are there any edge cases I should consider?"
```

## Limitations to Be Aware Of

1. **No Repository Access**: Share files explicitly instead of assuming Gemini can browse your repo
2. **Context Window**: Long files might hit token limits - split them up or summarize
3. **No Running Code**: Gemini can't run commands - you'll need to test changes yourself
4. **Version-Specific Advice**: Tell Gemini your React/Node versions for accurate guidance
5. **VGS Documentation**: Gemini may not know your specific VGS vault configuration

## Tips for Best Results with Gemini

1. **Provide Project Context**: Start with a brief description of what your project does
2. **Share Relevant Files**: Paste the code you're asking about
3. **Be Specific**: "Help me refactor this function" is better than "How do I write better code?"
4. **Show Dependencies**: Include package.json or import statements
5. **Describe Goals**: Explain what you're trying to achieve
6. **Ask Follow-ups**: "Why is that better?" helps you learn
7. **Test Suggestions**: Gemini's suggestions should be validated in your actual environment
8. **Ask for Alternatives**: "What other approaches could we use?" gets more perspectives

## Integration Tips

### For Code Review
```
"I need a code review of [component]. Focus on:
- Security (especially around the auth token)
- React best practices
- Performance optimization
Here's the code: [paste]"
```

### For Documentation
```
"Can you help me document [feature]?
I want to explain it to [audience type].
Here's what it does: [describe]"
```

### For Testing
```
"I need tests for this component [paste code].
Current test setup: [describe vitest/testing-library setup]
What test cases should I add?"
```

### For Debugging
```
"This behavior is unexpected [describe].
Here's the relevant code: [paste]
I think it might be because of [theory]...
Can you help me debug?"
```

## Next Steps

1. Review the [MANUAL.md](./MANUAL.md) to understand package usage
2. Check the [README.md](./README.md) for development setup
3. Look at test examples in `src/test/` for testing patterns
4. Review component stories in `.ladle/` for usage examples

## Quick Reference

- **Main Component**: `src/components/CollectForm/CollectForm.jsx`
- **Wrapper**: `src/components/CollectFormWrapper/CollectFormWrapper.jsx`
- **Tests**: `src/test/`
- **Build Config**: `vite.config.js`
- **Styles**: CSS Modules in component directories
- **Dependencies**: VGS Collect JS + React

Remember: While Gemini is powerful, always test changes in your actual environment and verify that security and functionality requirements are met!
