import React from 'react'
import { Table } from 'reactstrap'
import axios from 'axios'

export class Main extends React.Component {
  componentDidMount = async () => {
    const { REACT_APP_API_URL } = process.env
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/invoiceTxs`)
      console.log(response);
    } catch (error) {
      console.warn(error);
    }
  }

  render () {
    return (
      <div>

      </div>
    )
  }
}