import { ImportRateValueInterface } from './import-rate-value.interface'

import { StatusEnum } from '../enum/status.enum'

export interface IImportRate {
  _id?: string
  name: string
  value: ImportRateValueInterface
  status: StatusEnum
}
