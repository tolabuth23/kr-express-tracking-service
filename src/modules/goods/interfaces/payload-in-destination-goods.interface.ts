import { IDeliveryAddress } from './delivery-address.interface'

import { ICurrency } from '../../currency/interface/currency.interface'
import { ImportRateInterface } from '../../import-rate/interfaces/import-rate.interface'
import { IUser } from './user.interface'

export interface IPayloadInDestinationGoods {
  trackingNumber: string

  users: IUser

  weight: number

  categories: ImportRateInterface

  currency: ICurrency

  cod: number

  rate: number

  deliveryAddress: IDeliveryAddress
}
