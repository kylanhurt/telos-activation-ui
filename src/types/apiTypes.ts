export interface AxiosResponse {
  data: any
}

export interface InvoiceTx {
  url: string,
  requestedAccountName: string,
  ownerPublicKey: string,
  activePublicKey: string,
  btcPayInfo: any
}