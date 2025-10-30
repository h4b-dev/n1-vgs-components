import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useLimitsValidation from '../../src/hooks/useLimitsValidation'

describe('useLimitsValidation', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return canCreate as true when the api returns canCreateNewCard as true', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.canCreate).toBe(true)
  })

  it('should return canCreate as false when the api returns canCreateNewCard as false', async () => {
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

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.canCreate).toBe(false)
    expect(result.current.reason).toBe('Daily limit reached')
  })

  it('should return an error when the api call fails', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBe(null)
    expect(result.current.canCreate).toBe(false)
  })

  it('should handle case when reasonMessage is not provided in response', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        limits: {
          allowed: {
            canCreateNewCard: false,
            // reasonMessage is missing
          },
        },
      }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.canCreate).toBe(false)
    expect(result.current.reason).toBe('An unexpected error occurred.')
  })

  it('should handle case when limits object is missing in response', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        // limits object is missing
      }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.canCreate).toBe(false)
    expect(result.current.reason).toBe('An unexpected error occurred.')
  })

  it('should handle case when allowed object is missing in response', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        limits: {
          // allowed object is missing
        },
      }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.canCreate).toBe(false)
    expect(result.current.reason).toBe('An unexpected error occurred.')
  })

  it('should handle network error during fetch', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBe(null)
    expect(result.current.canCreate).toBe(false)
    expect(result.current.reason).toBe('An unexpected error occurred while validating limits.')
  })

  it('should not make api call when token is not provided', async () => {
    const { result } = renderHook(() => useLimitsValidation({ token: null, environment: 'dev' }))

    expect(result.current.loading).toBe(false)
    expect(result.current.canCreate).toBe(false)
    expect(window.fetch).not.toHaveBeenCalled()
  })
})

describe('useLimitsValidation - Sandbox environment', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should skip limits validation in sandbox environment', () => {
    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'sandbox' }))

    expect(result.current.loading).toBe(false)
    expect(result.current.canCreate).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.reason).toBe(null)
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should require token even in sandbox environment', () => {
    const { result } = renderHook(() => useLimitsValidation({ token: null, environment: 'sandbox' }))

    expect(result.current.loading).toBe(false)
    expect(result.current.canCreate).toBe(false)
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should require token in sandbox with empty token', () => {
    const { result } = renderHook(() => useLimitsValidation({ token: '', environment: 'sandbox' }))

    expect(result.current.loading).toBe(false)
    expect(result.current.canCreate).toBe(false)
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should still validate in dev environment', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'dev' }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(window.fetch).toHaveBeenCalled()
    expect(result.current.canCreate).toBe(true)
  })

  it('should still validate in prod environment', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ limits: { allowed: { canCreateNewCard: true } } }),
    })

    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'prod' }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(window.fetch).toHaveBeenCalled()
    expect(result.current.canCreate).toBe(true)
  })

  it('should return immediately in sandbox without waiting', () => {
    const { result } = renderHook(() => useLimitsValidation({ token: 'test-token', environment: 'sandbox' }))

    // In sandbox, these values should be set immediately, no need to wait
    expect(result.current.loading).toBe(false)
    expect(result.current.canCreate).toBe(true)
  })
})
