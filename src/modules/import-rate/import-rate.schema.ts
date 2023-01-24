import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { nanoid } from 'nanoid'

import { StatusEnum } from './enum/status.enum'
import { UnitEnum } from './enum/unit.enum'
import { ImportRateValueInterface } from './interfaces/import-rate-value.interface'

export type ImportRateDocument = ImportRate & Document

export class ImportRateValue {
  @Prop({
    type: Number,
    required: true,
  })
  min: number

  @Prop({
    type: Number,
    default: null,
  })
  max: number

  @Prop({
    type: Number,
    default: null,
  })
  rate: number

  @Prop({
    type: String,
    enum: UnitEnum,
  })
  type: string

  @Prop({
    type: String,
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status?: StatusEnum
}

@Schema({
  collection: 'import-rates',
  timestamps: true,
  versionKey: false,
})
export class ImportRate {
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
    index: true,
    required: true,
  })
  name: string

  @Prop({
    type: Object,
    default: {
      user: {
        type: [ImportRateValue],
        default: [],
      },
      dealer: {
        type: [ImportRateValue],
        default: [],
      },
    },
  })
  value: ImportRateValueInterface

  @Prop({
    type: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status?: StatusEnum
}

export const ImportRateSchema = SchemaFactory.createForClass(ImportRate)
