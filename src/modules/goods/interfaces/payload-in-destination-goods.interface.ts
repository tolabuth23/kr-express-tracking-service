import { IDeliveryAddress } from './delivery-address.interface'

import { ICurrency } from '../../currency/interface/currency.interface'
import { IImportRate } from '../../import-rate/interfaces/import-rate.interface'

export interface IPayloadInDestinationGoods {
  trackingNumber: string

  userId: string

  weight: number

  category: IImportRate

  currencyUnit: ICurrency

  cod: number

  rate: number

  deliveryAddress: IDeliveryAddress
}
