// src/test/setup.js
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom'
import {
  MockTextField,
  MockCardNumberField,
  MockCardExpirationDateField,
  MockCardSecurityCodeField,
  MockVGSCollectForm,
  mockVGSCollectState,
} from './mockComponents'

expect.extend(matchers)

// Define environment variables
export const ENV_VARS = {
  VITE_VGS_COLLECT_VERSION: '2.0.0',
  VITE_VGS_CREATE_ACTION: '/test/action',
  VITE_VGS_DEV_VAULT_ID: 'test-vault',
  VITE_VGS_DEV_ENVIRONMENT: 'sandbox',
  VITE_VGS_DEV_CNAME: 'test.sandbox.domain',
}

beforeAll(() => {
  // Suppress React warnings
  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args) => {
    if (/Warning.*React does not recognize/i.test(args[0]) || /Failed to load/i.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    if (/Failed to load/i.test(args[0])) {
      return
    }
    originalWarn.call(console, ...args)
  }

  // Mock import.meta.env
  vi.mock('import.meta.env', () => ENV_VARS, { virtual: true })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock VGS Collect dependencies
vi.mock('@vgs/collect-js', () => ({
  loadVGSCollect: vi.fn(() => Promise.resolve()),
}))

vi.mock('@vgs/collect-js-react', () => {
  const module = {
    VGSCollectForm: MockVGSCollectForm,
    VGSCollectProvider: ({ children }) => children,
    useVGSCollectState: vi.fn().mockReturnValue([mockVGSCollectState]),
  }

  module.VGSCollectForm.TextField = MockTextField
  module.VGSCollectForm.CardNumberField = MockCardNumberField
  module.VGSCollectForm.CardExpirationDateField = MockCardExpirationDateField
  module.VGSCollectForm.CardSecurityCodeField = MockCardSecurityCodeField

  return module
})

