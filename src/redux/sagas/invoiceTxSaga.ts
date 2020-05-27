import {
  call,
  put,
  takeEvery
} from 'redux-saga/effects'
import axios from 'axios'

function* fetchInvoiceTxs() {
  const { REACT_APP_API_URL } = process.env
  const invoiceTxs = yield call(() => axios.get(`${REACT_APP_API_URL}/invoiceTxs`))
  yield put({
    type: 'FETCH_INVOICE_TXS_SUCCESS',
    data: invoiceTxs.data
  })
}

function* invoiceTxSaga() {
  yield takeEvery('FETCH_INVOICE_TXS', fetchInvoiceTxs)
}

export default invoiceTxSaga
