import { ICurrency } from '../../currency/interface/currency.interface'
import { IDeliveryAddress } from './delivery-address.interface'
import { IUser } from './user.interface'

import { IDeliveryProvider } from '../../delivery-providers/interface/delivery-provider.interface'
import { ImportRateInterface } from '../../import-rate/interfaces/import-rate.interface'

export interface IPayloadDelivered {
  trackingNumber: string

  users: IUser

  cod: number

  weight: number

  categories: ImportRateInterface

  currency: ICurrency

  destinationTrackingNumber: string

  trackingProviders: IDeliveryProvider

  deliveryCost: number

  deliveryAddress: IDeliveryAddress
}
