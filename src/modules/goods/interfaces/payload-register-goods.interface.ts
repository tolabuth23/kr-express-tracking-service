import { IDeliveryAddress } from './delivery-address.interface'

export interface IPayloadRegisterGoods {
  shipPeriod: string

  trackingNumber: string

  userId: string

  cod: number

  deliveryAddress: IDeliveryAddress
}
