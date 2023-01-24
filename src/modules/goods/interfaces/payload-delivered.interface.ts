import { IDeliveryAddress } from './delivery-address.interface'
import { IUser } from './user.interface'

import { IDeliveryProvider } from '../../delivery-providers/interface/delivery-provider.interface'
import { IImportRate } from '../../import-rate/interfaces/import-rate.interface'

export interface IPayloadDelivered {
  trackingNumber: string

  user: IUser

  cod: number

  weight: number

  category: IImportRate

  currencyUnit: any

  destinationTrackingNumber: string

  trackingProvider: IDeliveryProvider

  deliveryCost: number

  deliveryAddress: IDeliveryAddress
}
