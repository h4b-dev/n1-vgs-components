import CollectForm from './CollectForm'

const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IktTN2hHWV9kUVlBV01ieU8xbW1UYSJ9.eyJodHRwczovL24xL3Nlc3Npb25JZCI6IjkwMDE2NjU0LTdmNDktNGYwMS04MTA5LTRiYjFmMjI4N2QwZCIsImh0dHBzOi8vbjEvY2xhaW1zL3Bob25lIjoiKzUwMjQ0NDcwMDAzIiwiaHR0cHM6Ly9oNGIvY2xhaW1zL3Bob25lIjoiKzUwMjQ0NDcwMDAzIiwiaHR0cHM6Ly9uMS9jbGFpbXMvdXNlci8yZmFfdGltZXN0YW1wIjoxNzIxODM0MTY4ODU4LCJodHRwczovL24xL2NsYWltcy91c2VyL2lkIjoiNEtjSElZVTI3ViIsImlzcyI6Imh0dHBzOi8vaWQuaDRiLmRldi8iLCJzdWIiOiJzbXN8NWZkYzFmODZiZTAzZDI0ZGM5MWEwN2M2IiwiYXVkIjpbImh0dHBzOi8vcGF5Lmg0Yi5kZXYvIiwiaHR0cHM6Ly9oNGItZGV2LWJ1eWVyLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MjE4MzQxNjksImV4cCI6MTcyMTkyMDU2OSwic2NvcGUiOiJvcGVuaWQgcGhvbmUgZW1haWwgcHJvZmlsZSBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIiwiYXpwIjoiNlpaUDZVc3lvM2x3SjE0RVFuNjJqMWRGVmg2N0Z5VXYifQ.PWY1vHPOppyr9wxDmfze1BN0kz2gUn3dJ4M5vZNI2ySHtvohGXiY2AdR3ld55ewEm-1CWxzVAY_m7uP7CRvdTF_QoFD-mE6YG5KQqSZAbL4tQxnhiWDn4gpKBIv4O3HDliOGpNsZGpByGuQ2QkwrpCp_xH5mIKLhllU8qpSkzFgt_C2Aqgp6wh4dYNgdJejDDIFgaVDhZLs-Ywjtd6TfCdckvJk0L8dcskFo4EYw2SJ4dJuRU8-v571eURd77YiOz6EfNOwUqcKELZtoGDOeXUbE7qEjPVGErSIUfDzckf7RsJBDiLHnmQulR7bBVtlo8bbIaSdBckrzsx8j-LP8FA`

export const Default = () => (
  <CollectForm
    environment="dev"
    token={token}
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

