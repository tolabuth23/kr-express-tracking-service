import { Controller, InternalServerErrorException } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LeanDocument, UpdateWriteOpResult } from 'mongoose'

import { IPayloadShipPeriod } from './interface/payload-ship-period.interface'
import { ShipPeriod, ShipPeriodDocument } from './ship-period.schema'
import { ShipPeriodService } from './ship-period.service'

import { LoggerService } from '../logger/logger.service'
import { SequenceService } from '../sequences/sequence.service'
import EStatusShip from './enum/status-ship.enum'

import { FindOptionsInterface } from '../../interfaces/find-optins.interface'
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../../interfaces/pageination.interface'
import { GoodsDocument } from '../goods/goodsSchema'

@Controller('ship-periods')
export class ShipPeriodMicroservice {
  private readonly logger: LoggerService = new LoggerService(
    ShipPeriodMicroservice.name,
  )

  constructor(
    private readonly shipPeriodService: ShipPeriodService,
    private readonly sequenceService: SequenceService,
  ) {}

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<ShipPeriodDocument>,
  ): Promise<PaginationResponseInterface<ShipPeriod>> {
    const { filter, page, perPage, select, sort } = payload
    try {
      const [records, count] = await this.shipPeriodService.getPagination(
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
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'register',
  })
  async register(@Payload() endAt: Date): Promise<ShipPeriodDocument> {
    try {
      const { value } = await this.sequenceService.getNextSequence(
        'SHIP_PERIOD',
      )
      return this.shipPeriodService.register(endAt, value)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getByObjectId',
  })
  async getByObjectId(
    @Payload() objectId: string,
  ): Promise<ShipPeriodDocument> {
    try {
      return this.shipPeriodService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getByStatus',
  })
  async getByStatus(
    @Payload() payload: { objectId: string; status: EStatusShip },
  ): Promise<ShipPeriodDocument> {
    const { objectId, status } = payload
    try {
      return this.shipPeriodService.getByStatus(objectId, status)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getByAvailable',
  })
  async getByAvailable(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<ShipPeriodDocument>,
  ): Promise<PaginationResponseInterface<ShipPeriod>> {
    const { filter, page, perPage, select, sort } = payload
    try {
      const [records, count] = await this.shipPeriodService.getByAvailable(
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
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'updateToInTransit',
  })
  async updateToInTransit(
    @Payload() payload: IPayloadShipPeriod,
  ): Promise<[LeanDocument<ShipPeriodDocument>, UpdateWriteOpResult]> {
    try {
      return this.shipPeriodService.updateToInTransit(payload)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'updateToInDestination',
  })
  async updateToInDestination(
    @Payload() payload: IPayloadShipPeriod,
  ): Promise<UpdateWriteOpResult> {
    try {
      return this.shipPeriodService.updateToInDestination(payload)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getOrderByUser',
  })
  async getUserByOrder(
    @Payload()
    payload: {
      query: PaginationInterface & FindOptionsInterface<GoodsDocument>
      shipPeriod: IPayloadShipPeriod
    },
  ): Promise<PaginationResponseInterface<ShipPeriod>> {
    const { query, shipPeriod } = payload
    const { filter, page, perPage } = query
    try {
      const [records, count] = await this.shipPeriodService.getUserOrder(
        shipPeriod as ShipPeriodDocument,
        filter,
        {
          page,
          perPage,
        },
      )
      return {
        page,
        perPage,
        count,
        records,
      }
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'shipPeriod',
    method: 'getByEndAt',
  })
  async getByEndAt(@Payload() endAt: Date): Promise<ShipPeriod | null> {
    try {
      return this.shipPeriodService.getByEndAt(endAt)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
