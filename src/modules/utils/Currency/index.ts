import { IImportRateValue } from '../../import-rate/interfaces/import-rate.interface'
import { IImportRateUnit } from './Interfaces/currencyIImportRate.interface'
import first from 'lodash/first'

export default class Currency {
  truWeight: number
  weight: number
  category: any
  currencyRate: number
  cod: number
  total = 0
  userRole: string
  rate = 0

  constructor(props: {
    rate?: number
    weight: number
    cod: number
    currencyRate: number
    category: IImportRateValue
    userRole: string
  }) {
    const { weight, category, currencyRate, cod, userRole, rate } = props
    this.weight = weight < 1 ? 1 : Math.ceil(weight)
    this.truWeight = weight
    this.category = category
    this.currencyRate = currencyRate
    this.cod = cod
    this.userRole = userRole
    this.rate = rate
  }

  categoryRate(): number {
    return this.getImportRate().rate
  }

  getTotal(): number {
    const calculateRate = this.rate ? this.rate : this.categoryRate()
    this.total = this.weight * calculateRate + this.cod * this.currencyRate

    return this.total
  }

  getImportRate(): IImportRateUnit {
    const category = this.category[this.userRole]
    if (category.length === 1) {
      return first(category)
    }

    const rates = category.filter((cat) => this.weight <= cat.max)
    if (rates.length === 0) {
      return category.find((cat) => !cat.max)
    }

    return first(rates)
  }
}
