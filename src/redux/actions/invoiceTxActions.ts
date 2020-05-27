import { Dispatch } from 'redux'
import axios from 'axios'

export const fetchInvoiceTxs = () => async (dispatch: Dispatch, getState: any) => {
  const { REACT_APP_API_URL } = process.env
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/invoiceTxs`)
    dispatch({
      type: 'SET_INVOICE_TXS',
      data: response.data
    })
  } catch (e) {
    console.warn('fetchInvoiceTxs error: ', e)
  }
}