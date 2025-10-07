import useLimitsValidation from '../../hooks/useLimitsValidation'
import CollectForm from '../CollectForm'
import LimitsMessage from '../LimitsMessage'

const CollectFormWrapper = (props) => {
  const { token, limitsApiUrl } = props
  const { canCreate, loading, error, reason } = useLimitsValidation({
    token,
    limitsApiUrl,
  })

  if (!token || !limitsApiUrl) {
    return <CollectForm {...props} />
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !canCreate) {
    return <LimitsMessage message={reason} />
  }

  return <CollectForm {...props} />
}

export default CollectFormWrapper
