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

const CollectForm = ({
  localeLbl = {
    cardName: 'Nombre de la tarjeta',
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

  const onSubmitCallback = (status, response) => {
    setIsFormLoading(false)
    onSubmit(response?.data?.id ?? null, status, response)
  }

  const onUpdateCallback = (state) => {
    onUpdate(state)
  }

  const onErrorCallback = (errors) => {
    onError(errors)
  }

  const isValid = !!state && Object.values(state).every((i) => i.isValid) && !isFormLoading

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
    return () => {}
  }, [])

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
          data: (fields) => ({
            Name: fields['Name'],
            Number: fields['Number'],
            BinNumber: state.Number.bin,
            LastFour: state.Number.last4,
            ExpirationDate: fields['ExpirationDate'],
            CustomerId: 'dennis7',
            AppId: 'fake-app',
            Cvv: fields['Cvv'],
            Brand: state.Number.cardType,
            Enabled: true,
            Blocked: false,
          }),
        }}
        onUpdateCallback={onUpdateCallback}
        onSubmitCallback={onSubmitCallback}
        onErrorCallback={onErrorCallback}>
        <div className="input">
          <label>{localeLbl.cardName}</label>
          <TextField name="Name" validations={['required']} css={VGSCollectFieldStyles} placeholder=" " />
        </div>
        <div className="input">
          <label>{localeLbl.cardNumber}</label>
          <CardNumberField
            name="Number"
            type="card-number"
            css={VGSCollectFieldStyles}
            placeholder="XXXX XXXX XXXX XXXX"
            showCardIcon={{
              right: '10px',
            }}
            errorColor={'#D8000C'}
            validCardBrands={validCardBrands}
            tokenization={{ format: 'UUID', storage: 'PERSISTENT' }}
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
              tokenization={{ format: 'UUID', storage: 'VOLATILE' }}
            />
          </div>
        </div>
        <button type="submit" disabled={!isValid}>
          {localeLbl.formAction}
        </button>
      </VGSCollectForm>
    </div>
  )
}

const WrappedForm = (props) => {
  const [isVGSCollectScriptLoaded, setCollectScriptLoaded] = useState(false)

  useEffect(() => {
    loadVGSCollect({
      ...ENV_CONFIG[props.environment || 'dev'],
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
export { CollectForm }
