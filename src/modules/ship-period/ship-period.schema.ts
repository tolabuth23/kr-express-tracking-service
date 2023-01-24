import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { nanoid } from 'nanoid'

import EStatusShip from './enum/status-ship.enum'

export type ShipPeriodDocument = ShipPeriod & Document

@Schema({
  collection: 'ship-periods',
  timestamps: true,
  versionKey: false,
})
export class ShipPeriod {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => nanoid(),
  })
  objectId?: string

  @Prop({
    type: Date,
    index: true,
    unique: true,
    required: true,
  })
  endAt: Date

  @Prop({
    enum: EStatusShip,
    default: EStatusShip.WAITING_TO_RECEIVE,
  })
  status?: EStatusShip

  @Prop({
    type: Number,
    required: true,
    unique: true,
    index: true,
  })
  runningNumber: number
}

export const ShipPeriodSchema = SchemaFactory.createForClass(ShipPeriod)
