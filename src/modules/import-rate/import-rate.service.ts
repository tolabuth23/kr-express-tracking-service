import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'

import { ImportRate, ImportRateDocument } from './import-rate.schema'
import { importRateInitData } from './init/import-rate.init'
import EStatus from './enum/status.enum'

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
    conditions: FilterQuery<ImportRateDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ) {
    const { page = 1, perPage = 20 } = pagination

    return Promise.all([
      this.importRateModule
        .find(ImportRate)
        .select(select)
        .skip((Number(page) - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.importRateModule.count(ImportRate),
    ])
  }

  async getOneImportRate(objectId: string): Promise<ImportRateDocument> {
    return this.importRateModule.findOne({ objectId: objectId }).lean()
  }

  async create(
    body: UpdateQuery<ImportRateDocument>,
  ): Promise<ImportRateDocument> {
    return this.importRateModule.create(body)
  }

  async update(
    objectId: string,
    body: UpdateQuery<ImportRateDocument>,
  ): Promise<ImportRateDocument> {
    return this.importRateModule.findOneAndUpdate({ objectId: objectId }, body)
  }

  async delete(objectId: string): Promise<string> {
    await this.importRateModule.findOneAndDelete({
      objectId: objectId,
      status: EStatus.INACTIVE,
    })
    return Promise.resolve('Delete import rate successfully')
  }

  async onModuleInit() {
    let importRates: ImportRateDocument[]

    try {
      importRates = await this.importRateModule.find().lean()
    } catch (e) {
      this.logger.error(
        `catch on importRateInit: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    for (const importRate of importRateInitData) {
      if (
        !importRates
          .map((importRates) => importRates.name)
          .includes(importRate.name)
      ) {
        await this.importRateModule.create(importRate)
      }
    }
  }
}
