import React from 'react'
import { Table } from 'reactstrap'
import axios from 'axios'
import { sprintf } from 'sprintf-js'
import {
  secondsToHms
}
from '../utils/utils'
import { CONSTANTS } from '../constants/index'

interface MainComponentProps {

}

interface MainComponentState {
  invoiceTxs: any[]
}

export class Main extends React.Component<MainComponentProps, MainComponentState> {
  constructor(props: any) {
    super(props)
    this.state = {
      invoiceTxs: []
    }
  }

  colorizeStatus = (status: string) => {
    switch (status) {
      case 'new':
        return 'orange'
      case 'expired':
        return 'red'
      case 'complete':
        return 'green'
      default:
        return 'black'
    }
  }

  componentDidMount = async () => {
    const { REACT_APP_API_URL } = process.env
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/invoiceTxs`)
      this.setState({
        invoiceTxs: response.data
      })
    } catch (error) {
      console.warn(error);
    }
  }

  render () {
    const { invoiceTxs } = this.state
    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Payment URI</th>
              <th>Invoice URL</th>
              <th>BTC</th>
              <th>USD</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(invoiceTxs).map((invoiceTx) => {
              const nowTime = (new Date()).getTime() / 1000
              const timeAgo = secondsToHms(nowTime - invoiceTx.invoiceTime)
              const accountBlockExplorerLink = sprintf(CONSTANTS.BLOCK_EXPLORER_ACCOUNT_BASE_URL, invoiceTx.requestedAccountName)
              const statusColor = this.colorizeStatus(invoiceTx.btcPayInfo.status)
              return (
                <tr key={invoiceTx._id}>
                  <td><a href={accountBlockExplorerLink}><strong>{invoiceTx.requestedAccountName}</strong></a></td>
                  <td>{invoiceTx.cryptoInfo[0].paymentUrls.BIP21}</td>
                  <td><a href={invoiceTx.url} target="_blank" rel="noopener noreferrer">link</a></td>
                  <td>{invoiceTx.cryptoInfo[0].totalDue}</td>
                  <td>$ {invoiceTx.price}</td>
                  <td style={{ color: statusColor }}>{invoiceTx.btcPayInfo.status}</td>
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