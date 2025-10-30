import { useState, useEffect } from 'react'

const CHECK_ACTION = String(import.meta.env.VITE_VGS_CHECK_ACTION)

const ENV_CONFIG = {
  dev: {
    cname: import.meta.env.VITE_VGS_DEV_CNAME,
  },
  sandbox: {
    cname: import.meta.env.VITE_VGS_SANDBOX_CNAME,
  },
  prod: {
    cname: import.meta.env.VITE_VGS_PROD_CNAME,
  },
}

export const getConfig = (environment) => {
  return ENV_CONFIG[environment] || ENV_CONFIG['dev']
}

const useLimitsValidation = ({ token, environment = 'dev' }) => {
  const [canCreate, setCanCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reason, setReason] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    // In sandbox environment, skip limits validation
    if (environment === 'sandbox') {
      setCanCreate(true)
      setLoading(false)
      return
    }

    const fetchLimits = async () => {
      try {
        const config = getConfig(environment)
        const limitsApiUrl = `https://${config.cname}${CHECK_ACTION}`

        const response = await fetch(limitsApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()

        if (data.limits?.allowed?.canCreateNewCard) {
          setCanCreate(true)
        } else {
          setCanCreate(false)
          setReason(data.limits?.allowed?.reasonMessage || 'An unexpected error occurred.')
        }
      } catch (e) {
        setError(e)
        setCanCreate(false)
        setReason('An unexpected error occurred while validating limits.')
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [token, environment])

  return { canCreate, loading, error, reason }
}

export default useLimitsValidation
