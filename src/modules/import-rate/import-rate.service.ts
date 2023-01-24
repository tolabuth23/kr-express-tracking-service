import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { nanoid } from 'nanoid'

import { StatusEnum } from './enum/status.enum'
import { UnitEnum } from './enum/unit.enum'
import { ValueEnum } from './enum/value.enum'
import { ImportRate, ImportRateDocument } from './import-rate.schema'
import { importRateInitData } from './init/import-rate.init'

import { LoggerService } from '../logger/logger.service'

@Injectable()
export class ImportRateService implements OnModuleInit {
  private readonly logger: LoggerService = new LoggerService(
    ImportRateService.name,
  )
  @InjectModel(ImportRate.name)
  private readonly importRateModule: Model<ImportRateDocument>

  getModel(): Model<ImportRateDocument> {
    return this.importRateModule
  }

  async getImportRates(
    conditions: FilterQuery<ImportRate>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ) {
    const { page = 1, perPage = 20 } = pagination

    return Promise.all([
      this.importRateModule
        .find(conditions as ImportRate)
        .select(select)
        .skip((Number(page) - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.importRateModule.count(conditions as ImportRate),
    ])
  }

  async getOneImportRates(objectId: string): Promise<ImportRate> {
    return this.importRateModule.findOne({ objectId: objectId }).lean()
  }

  // async findImportRateByTypeName(
  //   typeName: string,
  // ): Promise<ImportRate | undefined> {
  //   return this.importRateModule.findOne({ typeName }).lean()
  // }

  async createImportRates(body) {
    const { typeName, w0, w1, w2, w3 } = body
    const importRateValue = [
      {
        min: 0,
        max: 50,
        rate: w0,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 51,
        max: 99,
        rate: w1,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 100,
        max: 199,
        rate: w2,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 200,
        max: null,
        rate: w3,
        type: UnitEnum.KILOGRAM,
      },
    ]
    const createCreateObject = {
      name: typeName,
      value: {
        [ValueEnum.USER]: importRateValue,
        [ValueEnum.DEALER]: importRateValue,
      },
      status: StatusEnum.ACTIVE,
    }

    return this.importRateModule.create(createCreateObject)
  }

  async updateImportRates(objectId: string, body) {
    const { typeName, w0, w1, w2, w3 } = body
    const newImportRateValue = [
      {
        min: 0,
        max: 50,
        rate: w0,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 51,
        max: 99,
        rate: w1,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 100,
        max: 199,
        rate: w2,
        type: UnitEnum.KILOGRAM,
      },
      {
        min: 200,
        max: null,
        rate: w3,
        type: UnitEnum.KILOGRAM,
      },
    ]

    const rateUpdateObject = {
      name: typeName,
      value: {
        [ValueEnum.USER]: newImportRateValue,
        [ValueEnum.DEALER]: newImportRateValue,
      },
    }
    return this.importRateModule.findOneAndUpdate(
      { objectId: objectId },
      rateUpdateObject,
    )
  }

  async deleteImportRates(objectId: string) {
    return this.importRateModule.findOneAndDelete({
      objectId: objectId,
      status: StatusEnum.INACTIVE,
    })
  }

  async getImportRateByCategories(query: any, page: number, perPage: number) {
    let pCount, pRecord
    try {
      ;[pCount, pRecord] = await Promise.all([
        this.importRateModule.count(query),
        this.importRateModule
          .find(query)
          .select({
            name: 1,
            value: 1,
          })
          .skip((+page - 1) * +perPage)
          .limit(+perPage)
          .sort({ createdAt: 1 }),
      ])
    } catch (error) {
      this.logger.error(`ImportRate: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
    return [pCount, pRecord]
  }

  async onModuleInit() {
    let importRates: number
    try {
      importRates = await this.importRateModule.count()
    } catch (error) {
      this.logger.error(`ImportRate: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
    if (!importRates) {
      for (const importRate of importRateInitData) {
        const newImportRate = new this.importRateModule({
          name: importRate.name,
          status: importRate.status,
          value: importRate.value,
        })
        try {
          await newImportRate.save()
        } catch (error) {
          this.logger.error(`ImportRate: ${error.message ?? error}`)
          throw new InternalServerErrorException({
            message: error.message ?? error,
          })
        }
      }
    }
  }
}
