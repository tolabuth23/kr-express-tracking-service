import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { nanoid } from 'nanoid'

export type DeliveryProvidersDocument = DeliveryProviders & Document

@Schema({
  collection: 'delivery-providers',
  timestamps: true,
  versionKey: false,
})
export class DeliveryProviders {
  @Prop({
    type: String,
    required: true,
    index: true,
    unique: true,
    default: () => nanoid(),
  })
  objectId: string

  @Prop({
    type: String,
    required: true,
  })
  title: string

  @Prop({
    type: String,
    default: true,
  })
  requiredTrackingId: string
}

export const DeliveryProviderSchema =
  SchemaFactory.createForClass(DeliveryProviders)
