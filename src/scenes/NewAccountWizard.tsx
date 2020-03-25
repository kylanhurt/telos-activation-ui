import React from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
var debounce = require('lodash.debounce')

interface NewAccountWizardComponentProps {

}

interface NewAccountWizardComponentState {
  accountName: string
}

export class NewAccountWizardComponent extends React.Component<NewAccountWizardComponentProps, NewAccountWizardComponentState> {
  constructor (props: NewAccountWizardComponentProps) {
    super(props)
    this.state = {
      accountName: ''
    }
    this.fetchAccountNameAvailability = debounce(this.fetchAccountNameAvailability, 1000)
  }

  onChangeAccountName = (e: any) => {
    const accountName = e.target.value
    this.setState({
      accountName
    })
    this.fetchAccountNameAvailability(accountName)
  }

  fetchAccountNameAvailability(accountName: string) {
    console.log('starting search')
  }

  onClickNext = () => {

  }

  render () {
    return (
      <div>
        <Form>
          <FormGroup>
            <Label for="account-name">Account Name</Label>
            <Input onChange={this.onChangeAccountName} type="text" name="account-name" id="account-name" placeholder="theteloscrew" />
          </FormGroup>
          <Button onClick={this.onClickNext}>Next</Button>
        </Form>
      </div>
    )
  }
}