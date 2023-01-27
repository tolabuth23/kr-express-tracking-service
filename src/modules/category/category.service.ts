import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'

import { ImportRateService } from '../import-rate/import-rate.service'
import { ImportRateDocument } from '../import-rate/import-rate.schema'

@Injectable()
export class CategoryService {
  @Inject(forwardRef(() => ImportRateService))
  private readonly importRateService: ImportRateService

  async getCategories(
    conditions: FilterQuery<ImportRateDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {
      name: 1,
      value: 1,
    },
  ) {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.importRateService
        .getModel()
        .find(conditions)
        .select(select)
        .sort(sort)
        .skip((Number(page) - 1) * +perPage)
        .limit(+perPage),
      this.importRateService.getModel().countDocuments(conditions),
    ])
  }
}
