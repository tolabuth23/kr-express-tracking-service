import { Controller, InternalServerErrorException } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FindOptionsInterface } from '../../interfaces/find-optins.interface'
import { PaginationResponseInterface } from '../../interfaces/pageination.interface'
import { IPagination } from '../ship-period/interface/pagination.interface'

import EUnit from './enum/unit.enum'
import EValue from './enum/value.enum'
import { ImportRate, ImportRateDocument } from './import-rate.schema'
import { ImportRateService } from './import-rate.service'
import { IPayloadCreateImportRate } from './interfaces/payload-create-import-rate-interface'

import { LoggerService } from '../logger/logger.service'

@Controller()
export class ImportRateMicroservice {
  private readonly logger: LoggerService = new LoggerService(
    ImportRateMicroservice.name,
  )

  constructor(private readonly importRateService: ImportRateService) {}

  @MessagePattern({
    cmd: 'import-rate',
    method: 'getByObjectId',
  })
  async getByObjectId(@Payload() objectId: string) {
    try {
      return this.importRateService.getOneImportRate(objectId)
    } catch (e) {
      this.logger.error(
        `catch on getByObjectId: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'import-rate',
    method: 'getImportRates',
  })
  async getImportRates(
    @Payload() payload: IPagination & FindOptionsInterface<ImportRateDocument>,
  ): Promise<PaginationResponseInterface<ImportRate>> {
    const { filter, page, perPage, sort, select } = payload

    try {
      const [records, count] = await this.importRateService.getImportRates(
        filter,
        {
          page,
          perPage,
        },
        sort,
        select,
      )
      return {
        page,
        perPage,
        count,
        records,
      }
    } catch (e) {
      this.logger.error(
        `catch on getImportRates: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'import-rate',
    method: 'create',
  })
  async create(
    @Payload() payload: IPayloadCreateImportRate,
  ): Promise<ImportRateDocument> {
    const { typeName, w0, w1, w2, w3 } = payload
    const newImportRateValue = [
      {
        min: 0,
        max: 50,
        rate: w0,
        type: EUnit.KILOGRAM,
      },
      {
        min: 51,
        max: 99,
        rate: w1,
        type: EUnit.KILOGRAM,
      },
      {
        min: 100,
        max: 199,
        rate: w2,
        type: EUnit.KILOGRAM,
      },
      {
        min: 200,
        max: null,
        rate: w3,
        type: EUnit.KILOGRAM,
      },
    ]
    const body = {
      name: typeName,
      value: {
        [EValue.USER]: newImportRateValue,
        [EValue.DEALER]: newImportRateValue,
      },
    }

    try {
      return this.importRateService.create(body)
    } catch (e) {
      this.logger.error(
        `catch on createImportRate: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'import-rate',
    method: 'update',
  })
  async update(
    @Payload() payload: { objectId: string; body: IPayloadCreateImportRate },
  ): Promise<ImportRateDocument> {
    const { objectId, body } = payload
    const { typeName, w0, w1, w2, w3 } = body
    const newImportRateValue = [
      {
        min: 0,
        max: 50,
        rate: w0,
        type: EUnit.KILOGRAM,
      },
      {
        min: 51,
        max: 99,
        rate: w1,
        type: EUnit.KILOGRAM,
      },
      {
        min: 100,
        max: 199,
        rate: w2,
        type: EUnit.KILOGRAM,
      },
      {
        min: 200,
        max: null,
        rate: w3,
        type: EUnit.KILOGRAM,
      },
    ]
    const update = {
      name: typeName,
      value: {
        [EValue.USER]: newImportRateValue,
        [EValue.DEALER]: newImportRateValue,
      },
    }

    try {
      return this.importRateService.update(objectId, update)
    } catch (e) {
      this.logger.error(
        `catch on updateImportRate: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'import-rate',
    method: 'deleteImportRate',
  })
  async delete(@Payload() objectId: string): Promise<string> {
    try {
      return this.importRateService.delete(objectId)
    } catch (e) {
      this.logger.error(
        `catch on deleteImportRate ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
