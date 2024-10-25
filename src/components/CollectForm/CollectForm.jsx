import { useEffect, useState, useRef } from 'react'
import { VGSCollectForm, VGSCollectProvider, useVGSCollectState } from '@vgs/collect-js-react'
import { loadVGSCollect } from '@vgs/collect-js'
import { styles } from './CollectForm.module.css'

const { TextField, CardNumberField, CardExpirationDateField, CardSecurityCodeField } = VGSCollectForm

const COLLECT_VERSION = String(import.meta.env.VITE_VGS_COLLECT_VERSION)
const CREATE_ACTION = String(import.meta.env.VITE_VGS_CREATE_ACTION)

const VGSCollectFieldStyles = {
  fontFamily: 'Inter, Arial, sans-serif',
  padding: '.5rem 1rem',
  boxSizing: 'border-box',
  '&::placeholder': {
    color: '#777',
  },
}

const ENV_CONFIG = {
  dev: {
    vaultId: import.meta.env.VITE_VGS_DEV_VAULT_ID,
    environment: import.meta.env.VITE_VGS_DEV_ENVIRONMENT,
    cname: import.meta.env.VITE_VGS_DEV_CNAME,
  },
  sandbox: {
    vaultId: import.meta.env.VITE_VGS_SANDBOX_VAULT_ID,
    environment: import.meta.env.VITE_VGS_SANDBOX_ENVIRONMENT,
    cname: import.meta.env.VITE_VGS_SANDBOX_CNAME,
  },
  prod: {
    vaultId: import.meta.env.VITE_VGS_PROD_VAULT_ID,
    environment: import.meta.env.VITE_VGS_PROD_ENVIRONMENT,
    cname: import.meta.env.VITE_VGS_PROD_CNAME,
  },
}

export const onSubmitCallback = (setIsFormLoading, onSubmit) => (status, response) => {
  setIsFormLoading(false)
  onSubmit(response?.data?.id ?? null, status, response)
}

export const onUpdateCallback = (onUpdate) => (state) => {
  onUpdate(state)
}

export const onErrorCallback = (onError) => (errors) => {
  onError(errors)
}

export const formatSubmitData = (fields, state) => ({
  Name: fields['Name'],
  Number: fields['Number'],
  BinNumber: state.Number.bin,
  LastFour: state.Number.last4,
  ExpirationDate: fields['ExpirationDate'],
  Cvv: fields['Cvv'],
  Brand: state.Number.cardType,
  Enabled: true,
  Blocked: false,
})

export const getConfig = (environment) => {
  return ENV_CONFIG[environment] || ENV_CONFIG['dev']
}

const CollectForm = ({
  localeLbl = {
    cardName: 'Nombre en la tarjeta',
    cardNumber: 'Número de tarjeta',
    cardExp: 'Vencimiento',
    cardCVV: 'CVV',
    formAction: 'Agregar tarjeta',
  },
  validCardBrands = [{ type: 'visa' }, { type: 'mastercard' }],
  token = '',
  environment = 'dev', // dev, sandbox, prod
  onSubmit = () => {},
  onUpdate = () => {},
  onError = () => {},
}) => {
  const [state] = useVGSCollectState()
  const formContainerRef = useRef(null)
  const [isFormLoading, setIsFormLoading] = useState(false)

  useEffect(() => {
    const form = formContainerRef?.current?.querySelector('form')

    if (form) {
      const handleSubmit = (event) => {
        event.preventDefault()
        setIsFormLoading(true)
      }

      form.addEventListener('submit', handleSubmit)

      return () => {
        form.removeEventListener('submit', handleSubmit)
      }
    }
  }, [])

  const isValid = !!state && Object.values(state).every((i) => i.isValid)

  return (
    <div className={styles} ref={formContainerRef}>
      <VGSCollectForm
        {...ENV_CONFIG[environment]}
        action={CREATE_ACTION}
        tokenizationAPI={false}
        submitParameters={{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: (fields) => formatSubmitData(fields, state),
        }}
        onUpdateCallback={onUpdateCallback(onUpdate)}
        onSubmitCallback={onSubmitCallback(setIsFormLoading, onSubmit)}
        onErrorCallback={onErrorCallback(onError)}>
        <div className="input">
          <label>{localeLbl.cardName}</label>
          <TextField name="Name" validations={['required']} css={VGSCollectFieldStyles} placeholder=" " />
        </div>
        <div className="input">
          <label>{localeLbl.cardNumber}</label>
          <CardNumberField
            name="Number"
            type="card-number"
            validations={['required', 'validCardNumber']}
            css={VGSCollectFieldStyles}
            placeholder="XXXX XXXX XXXX XXXX"
            showCardIcon={{
              right: '10px',
            }}
            errorColor={'#D8000C'}
            validCardBrands={validCardBrands}
          />
        </div>
        <div className="input-row">
          <div className="input">
            <label>{localeLbl.cardExp}</label>
            <CardExpirationDateField
              name="ExpirationDate"
              type="card-expiration-date"
              validations={['required', 'validCardExpirationDate']}
              yearLength={2}
              css={VGSCollectFieldStyles}
              placeholder="12/24"
              showCardIcon={{
                right: '10px',
              }}
              successColor="#4F8A10"
              errorColor="#D8000C"
              separator="/"
            />
          </div>
          <div className="input">
            <label>{localeLbl.cardCVV}</label>
            <CardSecurityCodeField
              name="Cvv"
              type="card-security-code"
              validations={['required', 'validCardSecurityCode']}
              css={VGSCollectFieldStyles}
              showCardIcon={{
                right: '1rem',
              }}
              placeholder="•••"
              successColor="#4F8A10"
              errorColor="#D8000C"
            />
          </div>
        </div>
        <button type="submit" disabled={!isValid || isFormLoading}>
          {localeLbl.formAction}
        </button>
      </VGSCollectForm>
    </div>
  )
}

const WrappedForm = (props) => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false)

  const config = getConfig(props.environment)
  useEffect(() => {
    loadVGSCollect({
      ...config,
      version: COLLECT_VERSION,
    })
      .then(() => {
        setCollectScriptLoaded(true)
      })
      .catch((e) => {
        console.error(e)
        props.onError(e)
      })
  }, [props])

  return (
    isVGSCollectScriptLoaded && (
      <VGSCollectProvider>
        <CollectForm {...props} />
      </VGSCollectProvider>
    )
  )
}

export default WrappedForm
export { CollectForm, onSubmitCallback, onUpdateCallback, onErrorCallback, formatSubmitData }
