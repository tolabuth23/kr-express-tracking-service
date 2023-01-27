import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { nanoid } from 'nanoid'

import { IImportRateValue } from './interfaces/import-rate.interface'
import EStatus from './enum/status.enum'
import EUnit from './enum/unit.enum'

export type ImportRateDocument = ImportRate & Document

@Schema({
  _id: false,
  timestamps: true,
  versionKey: false,
})
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
    enum: EUnit,
  })
  type: string

  @Prop({
    type: String,
    enum: EStatus,
    default: EStatus.ACTIVE,
  })
  status?: EStatus
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
  objectId?: string

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
  value?: IImportRateValue

  @Prop({
    type: EStatus,
    default: EStatus.ACTIVE,
  })
  status?: EStatus
}

export const ImportRateSchema = SchemaFactory.createForClass(ImportRate)
