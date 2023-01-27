import { IDeliveryAddress } from './delivery-address.interface'

export interface IPayloadRegisterGoods {
  shipPeriod: string

  trackingNumber: string

  user: string

  cod: number

  deliveryAddress: IDeliveryAddress
}
