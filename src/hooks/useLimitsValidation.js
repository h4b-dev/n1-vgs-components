import { useState, useEffect } from 'react'

const useLimitsValidation = ({ token, limitsApiUrl }) => {
  const [canCreate, setCanCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reason, setReason] = useState(null)

  useEffect(() => {
    if (!token || !limitsApiUrl) {
      setLoading(false)
      return
    }

    const fetchLimits = async () => {
      try {
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
  }, [token, limitsApiUrl])

  return { canCreate, loading, error, reason }
}

export default useLimitsValidation
