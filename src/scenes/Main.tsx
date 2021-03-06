import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { sprintf } from 'sprintf-js'
import {
  secondsToHms
}
from '../utils/utils'
import { CONSTANTS } from '../constants/index'

interface MainComponentProps {
  fetchInvoiceTxs: () => void,
  recentInvoiceTxs: {
    [key: string]: any
  }
}

interface MainComponentState {
  recentInvoiceTxs: any[]
}

class Main extends React.Component<MainComponentProps, MainComponentState> {
  colorizeStatus = (status: string) => {
    switch (status) {
      case 'new':
        return 'orange'
      case 'expired':
        return 'red'
      case 'complete':
      case 'confirmed':
        return 'green'
      default:
        return 'black'
    }
  }

  componentDidMount = async () => {
    const { fetchInvoiceTxs } = this.props
    fetchInvoiceTxs()
    setInterval(fetchInvoiceTxs, 10000)
  }

  render () {
    const { recentInvoiceTxs } = this.props
    const sortedInvoiceTxs = Object.values(recentInvoiceTxs).sort((b , a) => a.invoiceTime - b.invoiceTime)
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const invoiceId = urlParams.get('id')
    return (
      <div>
        <NavLink to='/new-account' className='btn btn-primary'>New Account</NavLink>
        <br /><br />
        <Table striped>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Invoice ID</th>
              <th>BTC</th>
              <th>USD</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoiceTxs.map((invoiceTx) => {
              const nowTime = (new Date()).getTime() / 1000
              const timeAgo = secondsToHms(nowTime - invoiceTx.invoiceTime)
              const accountBlockExplorerLink = sprintf(CONSTANTS.EOS_BLOCK_EXPLORER_ACCOUNT_BASE_URL, invoiceTx.requestedAccountName)
              const statusColor = this.colorizeStatus(invoiceTx.btcPayInfo.status)
              const isComplete = invoiceTx.btcPayInfo.status === 'complete'
              const isChosen = invoiceId === invoiceTx.btcPayInfo.id
              return (
                <tr key={invoiceTx._id} style={isChosen ? { borderLeft: `4px solid ${statusColor}` } : {}}>
                  <td><a href={accountBlockExplorerLink}><strong>{invoiceTx.requestedAccountName}</strong></a></td>
                  <td><a href={invoiceTx.url} target="_blank" rel="noopener noreferrer">{invoiceTx.btcPayInfo.id}</a></td>
                  <td>{invoiceTx.cryptoInfo[0].totalDue}</td>
                  <td>$ {invoiceTx.price}</td>
                  <td style={{ color: statusColor }}>
                    {isComplete ? (
                      <a href={sprintf(CONSTANTS.BTC_BLOCK_EXPLORER_TRANSACTION_BASE_URL)} target="_blank" rel="noopener noreferrer">
                        <strong style={{ color: statusColor }}>{invoiceTx.btcPayInfo.status}</strong>
                      </a>
                    ) : (
                      <span>{invoiceTx.btcPayInfo.status}</span>
                    )}
                  </td>
                  <td>{timeAgo} ago</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    recentInvoiceTxs: state.invoiceTxReducer.recentInvoiceTxs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchInvoiceTxs: () => dispatch({ type: 'FETCH_INVOICE_TXS'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)