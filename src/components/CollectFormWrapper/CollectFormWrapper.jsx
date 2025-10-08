import PropTypes from 'prop-types'
import useLimitsValidation from '../../hooks/useLimitsValidation'
import CollectForm from '../CollectForm'
import LimitsMessage from '../LimitsMessage'

const CollectFormWrapper = (props) => {
  const { token, environment } = props
  const { canCreate, loading, error, reason } = useLimitsValidation({
    token,
    environment,
  })

  if (!token) {
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

CollectFormWrapper.propTypes = {
  token: PropTypes.string,
  environment: PropTypes.oneOf(['dev', 'sandbox', 'prod']),
  onError: PropTypes.func,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  localeLbl: PropTypes.shape({
    cardName: PropTypes.string,
    cardNumber: PropTypes.string,
    cardExp: PropTypes.string,
    cardCVV: PropTypes.string,
    formAction: PropTypes.string,
  }),
  validCardBrands: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    }),
  ),
}

export default CollectFormWrapper
