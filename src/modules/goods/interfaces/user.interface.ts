export interface Address {
  name: string
  phone: string
  province: string
  subDistrict: string
  district: string
  postCode: string
  description: string
  location: string
  isDefault: boolean
}

export interface Social {
  lineId: string
}

export interface IUser {
  _id?: string
  username: string
  email: string
  displayName: string
  address: Address
  objectId?: string
  phoneNumber: string
  password: string
  latestLogin?: Date
  status?: string
  roles?: string[]
  level: string
  token?: string
  social: Social
  changedPassword?: boolean
  createdAt?: string
  updatedAt?: string
}
