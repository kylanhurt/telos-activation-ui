import React from 'react'
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  Label,
  Input,
  Button,
  Form
} from 'reactstrap'
import axios from 'axios'
import {
  AxiosResponse,
  InvoiceTx
} from '../types/apiTypes'
interface NewAccountInfoComponentProps {
  match: any,
  location: any,
  history: any
}

interface NewAccountInfoComponentState {
  ownerFeedback: {
    color: string,
    message: string
  },
  activeFeedback: {
    color: string,
    message: string
  },
  formFeedback: {
    color: string,
    message: string
  }
  ownerPublicKey: string,
  activePublicKey: string
}

export class NewAccountInfoComponent extends React.Component<NewAccountInfoComponentProps, NewAccountInfoComponentState> {
  constructor(props: NewAccountInfoComponentProps) {
    super(props)
    this.state = {
      ownerPublicKey: '',
      activePublicKey: '',
      ownerFeedback: null,
      activeFeedback: null,
      formFeedback: null
    }
  }

  onChangeOwnerPublicKey = (e: any) => {
    const publicKey = e.target.value
    this.setState({ formFeedback: null })
    if (publicKey.length !== 53 || (publicKey.substring(0,3) !== 'EOS')) {
      this.setState({
        ownerFeedback: {
          color: 'red',
          message: 'Invalid public key'
        },
        ownerPublicKey: publicKey
      })
      return
    }
    this.setState({
      ownerFeedback: {
        color: 'green',
        message: 'Valid public key'
      },
      ownerPublicKey: publicKey
    })
  }

  onChangeActivePublicKey = (e: any) => {
    const publicKey = e.target.value
    this.setState({ formFeedback: null })
    if (publicKey.length !== 53 || (publicKey.substring(0,3) !== 'EOS')) {
      this.setState({
        activeFeedback: {
          color: 'red',
          message: 'Invalid owner public key'
        },
        activePublicKey: publicKey
      })
      return
    }
    this.setState({
      activeFeedback: {
        color: 'green',
        message: 'Valid active public key'
      },
      activePublicKey: publicKey
    })
  }

  onClickNext = async () => {
    const { history, location } = this.props
    const { REACT_APP_API_URL } = process.env
    const { accountName } = location.state
    const { ownerPublicKey, activePublicKey } = this.state
    let response
    this.setState({
      ownerFeedback: null,
      activeFeedback: null,
      formFeedback: null
    })
    try {
      response = await axios.post(`${REACT_APP_API_URL}/activateAccount`, {
        currencyCode: 'BTC',
        requestedAccountName: accountName,
        ownerPublicKey,
        activePublicKey
      })
      console.log('response is: ', response)
      if (response.status === 200) {
        // route to homepage?
        this.setState({
          activeFeedback: {
            color: 'green',
            message: 'Invoice successfully created. Please pay amount within allotted time frame.'
          }
        })
        const invoiceResponse: AxiosResponse = await axios.get(`${REACT_APP_API_URL}/invoiceTxs`)
        const correctInvoice: any = Object.values(invoiceResponse.data).find((invoice: InvoiceTx) => {
          return (
            invoice.requestedAccountName === accountName &&
            invoice.ownerPublicKey === ownerPublicKey &&
            invoice.activePublicKey === activePublicKey
          )
        })
        if (!correctInvoice) throw new Error('Unable to find invoice')
        const invoiceUrl = correctInvoice.url
        const win = window.open(invoiceUrl, '_blank')
        win.focus()
        history.push(`/?id=${correctInvoice.btcPayInfo.id}`)
      }
    } catch (e) {
      if (e && e.response && e.response.data) {
        const message = e.response.data.reduce((accumulator, currentValue) => {
          return accumulator + ' ' + currentValue.message
        }, '')
        this.setState({
          formFeedback: {
            color: 'red',
            message
          }
        })
      }
    }
  }

  render() {
    const { ownerFeedback, activeFeedback, formFeedback } = this.state
    let isValid = false
    if ((ownerFeedback && ownerFeedback.color === 'green') && (activeFeedback && activeFeedback.color === 'green')) {
      isValid = true
    }

    return (
      <div>
        <Form className='col-md-4'>
          <FormGroup>
            <Label for="owner-public-key">Owner Public Key</Label>
            <div>
              <Input
                onChange={this.onChangeOwnerPublicKey}
                type="text"
                name="owner-public-key"
                id="owner-public-key"
                placeholder="EOS5QoxG7ExampleD5pUfS2G2JA3JvvWbcEFfsrfiHU5CDjDb7XD1R"
              />&nbsp;
            </div>
          <div style={{ height: 30 }}>
            {!!ownerFeedback && (
              <span style={{ color: ownerFeedback.color }}>{ownerFeedback.message}</span>
            )}
          </div>

          <Label for="active-public-key">Active Public Key</Label>
            <div>
              <Input
                onChange={this.onChangeActivePublicKey}
                type="text"
                name="active-public-key"
                id="active-public-key"
                placeholder="EOS8QoxG7ExampleD5pUfS2G2JA3JvvWbcEFfsrfiHU5CDjDb7XD1R"
              />&nbsp;
            </div>
          <div style={{ height: 30 }}>
            {!!activeFeedback && (
              <span style={{ color: activeFeedback.color }}>{activeFeedback.message}</span>
            )}
            </div>
          </FormGroup>
          <Button color='primary' disabled={!isValid} onClick={this.onClickNext}>Next</Button>
          <br />
          <div>
            {!!formFeedback && (
              <span style={{ color: formFeedback.color }}>{formFeedback.message}</span>
            )}
          </div>
        </Form>
      </div>
    )
  }
}

export const NewAccountInfoComponentWithRouter = withRouter(NewAccountInfoComponent)