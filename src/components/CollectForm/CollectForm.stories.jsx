import CollectForm from './CollectForm'

export const Default = () => (
  <CollectForm
    environment="dev"
    token=""
    onSubmit={(id, httpStatus, httpResponse) => {
      // This will be called when the submit button is pressed.
      // It will be called even on errors
      console.log('onSubmit:id', id) // this will be null if the request is in error
      console.log('onSubmit:httpStatus', httpStatus) // generally 200 or 400
      // note that status could be 200 on an error such as 'the same card already exists'
      console.log('onSubmit:httpResponse', httpResponse) // raw http response from tokenization
   }}
    onUpdate={(state) => {
      // this gets called for every state change
      // it gets called a bunch of times at the start
      // might be useful to get the bin and the last 4 digits real time
      console.log('onUpdate:state', state)
    }}
    onError={(errors) => {
      // this will be called if the submit button is pressed but there are errors in the form
      // it will also be called on more generic errors, such as the collect-js module failing to load
      console.log('onError:errors', errors)
    }}
  />
)

export const Dev = () => (
  <CollectForm
    environment="dev"
    token=""
    onSubmit={(id, httpStatus, httpResponse) => {
      // This will be called when the submit button is pressed.
      // It will be called even on errors
      console.log('onSubmit:id', id) // this will be null if the request is in error
      console.log('onSubmit:httpStatus', httpStatus) // generally 200 or 400
      // note that status could be 200 on an error such as 'the same card already exists'
      console.log('onSubmit:httpResponse', httpResponse) // raw http response from tokenization
   }}
    onUpdate={(state) => {
      // this gets called for every state change
      // it gets called a bunch of times at the start
      // might be useful to get the bin and the last 4 digits real time
      console.log('onUpdate:state', state)
    }}
    onError={(errors) => {
      // this will be called if the submit button is pressed but there are errors in the form
      // it will also be called on more generic errors, such as the collect-js module failing to load
      console.log('onError:errors', errors)
    }}
  />
)

export const Sandbox = () => (
  <CollectForm
    environment="sandbox"
    token=""
    onSubmit={(id, httpStatus, httpResponse) => {
      // This will be called when the submit button is pressed.
      // It will be called even on errors
      console.log('onSubmit:id', id) // this will be null if the request is in error
      console.log('onSubmit:httpStatus', httpStatus) // generally 200 or 400
      // note that status could be 200 on an error such as 'the same card already exists'
      console.log('onSubmit:httpResponse', httpResponse) // raw http response from tokenization
   }}
    onUpdate={(state) => {
      // this gets called for every state change
      // it gets called a bunch of times at the start
      // might be useful to get the bin and the last 4 digits real time
      console.log('onUpdate:state', state)
    }}
    onError={(errors) => {
      // this will be called if the submit button is pressed but there are errors in the form
      // it will also be called on more generic errors, such as the collect-js module failing to load
      console.log('onError:errors', errors)
    }}
  />
)

export const Prod = () => (
  <CollectForm
    environment="prod"
    token=""
    onSubmit={(id, httpStatus, httpResponse) => {
      // This will be called when the submit button is pressed.
      // It will be called even on errors
      console.log('onSubmit:id', id) // this will be null if the request is in error
      console.log('onSubmit:httpStatus', httpStatus) // generally 200 or 400
      // note that status could be 200 on an error such as 'the same card already exists'
      console.log('onSubmit:httpResponse', httpResponse) // raw http response from tokenization
   }}
    onUpdate={(state) => {
      // this gets called for every state change
      // it gets called a bunch of times at the start
      // might be useful to get the bin and the last 4 digits real time
      console.log('onUpdate:state', state)
    }}
    onError={(errors) => {
      // this will be called if the submit button is pressed but there are errors in the form
      // it will also be called on more generic errors, such as the collect-js module failing to load
      console.log('onError:errors', errors)
    }}
  />
)

