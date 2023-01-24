import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { nanoid } from 'nanoid'
import { IImportRateUnit } from '../../utils/Currency/Interfaces/currencyIImportRate.interface'
import { ImportRate } from '../import-rate/import-rate.schema'
import { IImportRate } from '../import-rate/interfaces/import-rate.interface'

import { OriginDestinationEnum } from './enums/origin-destination.enum'
import EStatusGoods from './enums/status-goods.enum'
import { IDeliveryAddress } from './interfaces/delivery-address.interface'
import { IUser } from './interfaces/user.interface'

import { ICurrency } from '../currency/interface/currency.interface'
import { DeliveryProviders } from '../delivery-providers/delivery-provider.schema'
import { IDeliveryProvider } from '../delivery-providers/interface/delivery-provider.interface'

import { ShipPeriod } from '../ship-period/ship-period.schema'

export type GoodsDocument = Goods & Document

@Schema({
  collection: 'goods',
  timestamps: true,
  versionKey: false,
})
export class Goods {
  @Prop({
    type: String,
    required: true,
    index: true,
    unique: true,
    default: () => nanoid(),
  })
  objectId?: string

  @Prop({
    type: SchemaTypes.ObjectId,
    index: true,
    default: null,
  })
  user: IUser

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ShipPeriod.name,
    index: true,
    default: null,
  })
  shipPeriod: Types.ObjectId

  @Prop({
    type: String,
    index: true,
    default: null,
  })
  trackingNumber: string

  @Prop({
    type: String,
    required: true,
  })
  qr: string

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: ImportRate.name,
    index: true,
    default: null,
  })
  category: IImportRate

  @Prop({
    enum: EStatusGoods,
    default: EStatusGoods.CREATED,
  })
  status?: EStatusGoods

  @Prop({
    type: Number,
    default: null,
  })
  weight: number

  @Prop({
    type: Number,
    default: 0,
  })
  cod: number

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  rate: number

  @Prop({
    type: Object,
    default: null,
  })
  currency: ICurrency

  @Prop({
    type: Object,
    default: null,
  })
  importRate: IImportRateUnit

  @Prop({
    type: Number,
    default: 0,
  })
  total: number

  @Prop({
    type: String,
    eum: [null, OriginDestinationEnum.JP],
    default: null,
  })
  origin: string

  @Prop({
    type: Date,
    default: null,
  })
  originArrivedAt: Date

  @Prop({
    type: String,
    enum: [null, OriginDestinationEnum.TH],
    default: null,
  })
  destination?: string

  @Prop({
    type: Date,
    default: null,
  })
  destinationArrivedAt: Date

  @Prop({
    type: Date,
    default: null,
  })
  deliveredAt: Date

  @Prop({
    type: Date,
    default: null,
  })
  weighedAt: Date

  @Prop({
    type: Object,
  })
  meta?: Record<string, any>

  @Prop({
    type: Object,
    default: null,
  })
  deliveryAddress: IDeliveryAddress

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DeliveryProviders.name,
    index: true,
    default: null,
  })
  trackingProvider: IDeliveryProvider

  @Prop({
    type: String,
    default: null,
  })
  destinationTrackingNumber: string

  @Prop({
    type: Number,
    default: null,
  })
  deliveryCost: number
}

export const GoodsSchema = SchemaFactory.createForClass(Goods)
