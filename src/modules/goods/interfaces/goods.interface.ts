import { ICurrency } from '../../currency/interface/currency.interface'
import { ImportRateInterface } from '../../import-rate/interfaces/import-rate.interface'
import { IDeliveryAddress } from './delivery-address.interface'

export interface GoodsInterface {
  objectId: string

  user?: string

  shipPeriod?: string

  trackingNumber?: string

  qr: string

  category?: any

  status?: string

  weight?: number

  cod?: number

  rate?: number

  currency?: ICurrency

  importRate?: ImportRateInterface

  total?: number

  origin?: string

  originArrivedAt?: Date

  destination?: string

  destinationArrivedAt?: Date

  deliveredAt?: Date

  weighedAt?: Date

  meta?: any

  deliveryAddress?: IDeliveryAddress

  trackingProvider?: string

  destinationTrackingNumber?: string

  deliveryCost?: number
}
