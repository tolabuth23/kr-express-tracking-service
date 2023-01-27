import * as qrCode from 'qrcode'

import {
  IQRCode,
  IConstructor,
} from './types'

export default class QRCode implements IQRCode {
  data: any
  qr: string

  constructor({ data }: IConstructor) {
    this.qr = null
    this.data = data
  }

  async getQR() {
    this.qr = await qrCode.toDataURL(JSON.stringify(this.data))
    return this.qr
  }
}
