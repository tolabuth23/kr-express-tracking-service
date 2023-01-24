import { IDeliveryAddress } from './delivery-address.interface'
import { IUser } from './user.interface'

export interface IGoods {
  objectId: string

  user: IUser

  shipPeriod?: any

  trackingNumber?: string

  qr: string

  category?: any

  status?: string

  weight?: number

  cod?: number

  rate?: number

  currency?: any

  importRate?: any

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
