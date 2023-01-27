import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, UpdateWriteOpResult } from 'mongoose'
import { IShipPeriod } from '../goods/interfaces/ship-period.interface'

import EStatusShip from './enum/status-ship.enum'
import { ShipPeriod, ShipPeriodDocument } from './ship-period.schema'

import { GoodsDocument } from '../goods/goods.schema'
import { GoodsService } from '../goods/goods.service'
import EStatusGoods from '../goods/enums/status-goods.enum'
import { LoggerService } from '../logger/logger.service'

import { RMQService } from '../../microservice.constants'

@Injectable()
export class ShipPeriodService {
  private readonly logger: LoggerService = new LoggerService(
    ShipPeriodService.name,
  )
  @Inject(RMQService.User) private readonly userService: ClientProxy
  @InjectModel(ShipPeriod.name)
  private shipPeriodModel: Model<ShipPeriodDocument>
  @Inject(forwardRef(() => GoodsService))
  private goodsService: GoodsService

  getModel(): Model<ShipPeriodDocument> {
    return this.shipPeriodModel
  }

  async getByObjectId(
    objectId: string,
    query: object,
  ): Promise<ShipPeriodDocument> {
    return this.shipPeriodModel.findOne({ objectId, ...query })
  }

  async register(endAt: Date, value: number): Promise<ShipPeriodDocument> {
    try {
      return this.shipPeriodModel.create({
        endAt,
        runningNumber: value,
      })
    } catch (error) {
      this.logger.error(`ShipPeriod: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  async getPagination(
    conditions: FilterQuery<ShipPeriodDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ): Promise<[ShipPeriod[], number]> {
    const { page = 1, perPage = 20 } = pagination

    const [count, recordShipPeriods] = await Promise.all([
      this.shipPeriodModel.count(conditions),
      this.shipPeriodModel
        .find(conditions as ShipPeriod)
        .select(select)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
    ])

    const records = []
    for (const shipPeriod of recordShipPeriods) {
      const promises: any[] = [
        this.goodsService.countGoodsReceivedByShipPeriod(shipPeriod._id),
        this.goodsService.countGoodsInDestinationByShipPeriod(shipPeriod._id),
        this.goodsService.countUserOrderByShipPeriod(shipPeriod._id),
        this.goodsService.countUsersTookGoodsByShipPeriod(shipPeriod._id),
      ]
      const [goodsReceived, goodsInDestination, usersOrder, usersTookGoods] =
        await Promise.all(promises)

      records.push({
        ...shipPeriod,
        goodsReceived,
        goodsInDestination,
        usersOrder,
        usersTookGoods,
      })
    }

    return Promise.all([records, count])
  }

  async getByAvailable(
    conditions: FilterQuery<ShipPeriodDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ): Promise<[ShipPeriod[], number]> {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.shipPeriodModel
        .find(conditions)
        .select(select)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.shipPeriodModel.countDocuments(conditions),
    ])
  }

  async updateToInTransit(
    objectId: string,
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]> {
    return Promise.all([
      this.shipPeriodModel
        .updateOne({ objectId }, { status: EStatusShip.IN_TRANSIT })
        .lean(),
      this.goodsService
        .getModel()
        .updateMany(
          { shipPeriod: objectId },
          { status: EStatusGoods.IN_TRANSIT },
        )
        .lean(),
    ])
  }

  async updateToInDestination(objectId: string): Promise<UpdateWriteOpResult> {
    return this.shipPeriodModel.updateOne(
      { objectId },
      { status: EStatusShip.IN_DESTINATION },
    )
  }

  async getUserOrderByShipPeriod(
    shipPeriod: IShipPeriod,
    conditions: FilterQuery<GoodsDocument>,
    pagination?: { page: number; perPage: number },
  ) {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.goodsService.getUserOrderByShipPeriod(
        shipPeriod.objectId,
        conditions,
        (page - 1) * +perPage,
        perPage,
      ),
      this.goodsService.countUserOrderByShipPeriod(
        shipPeriod.objectId,
        conditions,
      ),
    ])
  }

  async getByEndAt(endAt: Date): Promise<ShipPeriodDocument> {
    return this.shipPeriodModel.findOne({ endAt: endAt }).lean()
  }

  async getByStatus(
    objectId: string,
    status: EStatusShip,
  ): Promise<ShipPeriodDocument> {
    return this.shipPeriodModel.findOne({ objectId, status }).lean()
  }
}
