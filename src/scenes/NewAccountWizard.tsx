import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import spinner from '../assets/img/spinner.gif'
import axios from 'axios'
import debounce from 'lodash.debounce'

interface NewAccountWizardComponentProps {

}

interface NewAccountWizardComponentState {
  accountName: string,
  feedback: {
    color: string | null,
    message: string
  },
  isProcessing: boolean
}

export class NewAccountWizardComponent extends React.Component<NewAccountWizardComponentProps, NewAccountWizardComponentState> {
  constructor (props: NewAccountWizardComponentProps) {
    super(props)
    this.state = {
      accountName: '',
      feedback: null,
      isProcessing: false
    }
    this.fetchAccountNameAvailability = debounce(this.fetchAccountNameAvailability, 400)
  }

  onChangeAccountName = (e: any) => {
    const accountName = e.target.value
    this.setState({
      accountName
    })
    if (accountName.length === 12) {
      this.setState({ feedback: null })
      this.fetchAccountNameAvailability(accountName)
      return
    }
    this.setState({
      feedback: {
        color: 'red',
        message: 'Account name must be 12 characters in length'
      },
      accountName
    })
  }

  fetchAccountNameAvailability = async (accountName: string) => {
    this.setState({
      isProcessing: true
    })
    console.log('starting search')
    let color
    let message
    try {
      const { REACT_APP_EOS_V1_NODE } = process.env
      const { accountName } = this.state
      const response = await axios.post(`${REACT_APP_EOS_V1_NODE}/chain/get_account`, {
        account_name: accountName
      })
      if (response.status === 200) {
        color = 'red'
        message = 'Account name unavailable'
      }
      console.log('response: ', response)
    } catch (e) {
        color = 'green'
        message = 'Account name available'
    }
    this.setState({
      feedback: {
        color,
        message
      },
      isProcessing: false
    })
  }

  onClickNext = () => {

  }

  render () {
    const { feedback, isProcessing } = this.state
    return (
      <div>
        <Form className='col-md-4'>
          <FormGroup>
            <Label for="account-name">Account Name</Label>
            <div>
              <Input
                onChange={this.onChangeAccountName}
                type="text"
                name="account-name"
                id="account-name"
                placeholder="theteloscrew"
                style={{ display: 'inline', width: 300 }}
              />&nbsp;
              <img style={{ width: 24, height: 24, visibility: isProcessing ? 'visible' : 'hidden' }} src={spinner} alt="spinner" />
            </div>

          </FormGroup>
          <div style={{ height: 30 }}>
            {!!feedback && (
              <span style={{ color: feedback.color }}>{feedback.message}</span>
            )}
          </div>
          <br />
          <Button onClick={this.onClickNext}>Next</Button>
        </Form>
      </div>
    )
  }
}