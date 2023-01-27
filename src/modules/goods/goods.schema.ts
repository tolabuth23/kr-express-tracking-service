import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { nanoid } from 'nanoid'

import { OriginDestinationEnum } from './enums/origin-destination.enum'
import EStatusGoods from './enums/status-goods.enum'
import { IDeliveryAddress } from './interfaces/delivery-address.interface'

import { ICurrency } from '../currency/interface/currency.interface'
import { IImportRateUnit } from '../utils/Currency/Interfaces/currencyIImportRate.interface'

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
    type: String,
    index: true,
    default: null,
  })
  user?: string

  @Prop({
    type: String,
    index: true,
    default: null,
  })
  shipPeriod?: string

  @Prop({
    type: String,
    index: true,
    default: null,
  })
  trackingNumber?: string

  @Prop({
    type: String,
    required: true,
  })
  qr: string

  @Prop({
    type: String,
    index: true,
    default: null,
  })
  category?: string

  @Prop({
    enum: EStatusGoods,
    default: EStatusGoods.CREATED,
  })
  status?: EStatusGoods

  @Prop({
    type: Number,
    default: 0,
  })
  weight?: number

  @Prop({
    type: Number,
    default: 0,
  })
  cod?: number

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  rate?: number

  @Prop({
    type: Object,
    default: null,
  })
  currency?: ICurrency

  @Prop({
    type: Object,
    default: null,
  })
  importRate?: IImportRateUnit

  @Prop({
    type: Number,
    default: 0,
  })
  total?: number

  @Prop({
    eum: [null, OriginDestinationEnum.JP],
    default: null,
  })
  origin?: OriginDestinationEnum

  @Prop({
    type: Date,
    default: null,
  })
  originArrivedAt?: Date

  @Prop({
    enum: [null, OriginDestinationEnum.TH],
    default: null,
  })
  destination?: OriginDestinationEnum

  @Prop({
    type: Date,
    default: null,
  })
  destinationArrivedAt?: Date

  @Prop({
    type: Date,
    default: null,
  })
  deliveredAt?: Date

  @Prop({
    type: Date,
    default: null,
  })
  weighedAt?: Date

  @Prop({
    type: Object,
  })
  meta?: Record<string, any>

  @Prop({
    type: Object,
    default: null,
  })
  deliveryAddress?: IDeliveryAddress

  @Prop({
    type: String,
    index: true,
    default: null,
  })
  trackingProvider?: string

  @Prop({
    type: String,
    default: null,
  })
  destinationTrackingNumber?: string

  @Prop({
    type: Number,
    default: null,
  })
  deliveryCost?: number
}

export const GoodsSchema = SchemaFactory.createForClass(Goods)
