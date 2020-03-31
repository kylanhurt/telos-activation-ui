import { combineReducers } from 'redux'

export const recentInvoiceTxs = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'SET_INVOICE_TXS_SUCCESS':
      return action.data
    default:
      return state
  }
}

export const invoiceTxReducer = combineReducers({
  recentInvoiceTxs
})