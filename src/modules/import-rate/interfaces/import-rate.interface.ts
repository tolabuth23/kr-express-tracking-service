import EStatus from '../enum/status.enum'
export interface IImportRateValue {
  user: object
  dealer: object
}

export interface ImportRateInterface {
  objectId?: string
  name: string
  value: IImportRateValue
  status: EStatus
}
