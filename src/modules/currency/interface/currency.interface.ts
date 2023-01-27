import { IImportRateUnit } from '../../utils/Currency/Interfaces/currencyIImportRate.interface'

export interface ICurrency {
  objectId: string
  title: string
  currencyUnit: IImportRateUnit
  value: number
}
