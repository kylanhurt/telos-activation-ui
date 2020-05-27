import { createActions } from 'reduxsauce'

const { Creators, Types } = createActions({
  // keys of creators and types
  fetchInvoiceTxsSuccss: ['data']
})