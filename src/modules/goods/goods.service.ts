import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { sumBy } from 'lodash'
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose'

import EStatusGoods from './enums/status-goods.enum'
import { Goods, GoodsDocument } from './goods.schema'

import { LoggerService } from '../logger/logger.service'
import EStatusShip from '../ship-period/enum/status-ship.enum'
import { ShipPeriodService } from '../ship-period/ship-period.service'

@Injectable()
export class GoodsService {
  private readonly logger: LoggerService = new LoggerService(GoodsService.name)

  @InjectModel(Goods.name) private readonly goodsModule: Model<GoodsDocument>
  @Inject(forwardRef(() => ShipPeriodService))
  private readonly shipPeriodService: ShipPeriodService

  getModel(): Model<GoodsDocument> {
    return this.goodsModule
  }

  async getPagination(
    conditions: FilterQuery<GoodsDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ): Promise<[Goods[], number]> {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.goodsModule
        .find(conditions)
        .select(select)
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.goodsModule.count(conditions),
    ])
  }

  async create(qrCode: object): Promise<GoodsDocument> {
    return this.goodsModule.create(qrCode)
  }

  async register(
    objectId: string,
    body: UpdateQuery<GoodsDocument>,
  ): Promise<UpdateWriteOpResult> {
    return this.goodsModule.updateOne({ objectId }, body, {
      new: true,
    })
  }

  async getByTrackingNumber(trackingNumber: string): Promise<GoodsDocument> {
    return this.goodsModule
      .findOne({
        trackingNumber,
      })
      .lean()
  }

  async getByObjectId(objectId: string, query: object): Promise<GoodsDocument> {
    return this.goodsModule
      .findOne({
        objectId,
        ...query,
      })
      .select({ qr: 0 })
      .lean()
  }

  async getByShipPeriod(
    objectId: string,
    query = {},
  ): Promise<GoodsDocument[]> {
    return this.goodsModule
      .find({
        shipPeriod: objectId,
        status: { $in: [EStatusGoods.IN_DESTINATION, EStatusGoods.DELIVERED] },
        ...query,
      })
      .lean()
  }

  async UpdateToInDestination(
    objectId: string,
    shipObjectId: string,
    update: UpdateQuery<GoodsDocument>,
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]> {
    return Promise.all([
      this.goodsModule.updateOne({ objectId }, update, {
        new: true,
      }),
      this.shipPeriodService
        .getModel()
        .updateOne(
          { objectId: shipObjectId },
          { status: EStatusShip.IN_DESTINATION },
        ),
    ])
  }

  async delivered(
    objectId: string,
    update: UpdateQuery<GoodsDocument>,
  ): Promise<UpdateWriteOpResult> {
    return this.goodsModule.updateOne({ objectId }, update, {
      new: true,
    })
  }

  async countGoodsReceivedByShipPeriod(shipPeriodId: string): Promise<number> {
    return this.goodsModule.count({ _id: shipPeriodId }).lean()
  }

  async countGoodsInDestinationByShipPeriod(
    shipPeriodId: string,
  ): Promise<number> {
    try {
      const record = await this.getGoodsInDestinationByShipPeriod(shipPeriodId)
      return record.length
    } catch (error) {
      this.logger.error(`count goods: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  async getGoodsInDestinationByShipPeriod(
    shipPeriodId: string,
    conditions = {},
  ): Promise<GoodsDocument[]> {
    return this.goodsModule
      .find({
        shipPeriod: shipPeriodId,
        status: {
          $in: [EStatusGoods.IN_DESTINATION, EStatusGoods.DELIVERED],
        },
        ...conditions,
      })
      .lean()
  }

  async countUserOrderByShipPeriod(shipPeriod, query = {}): Promise<number> {
    try {
      const record = await this.getUserOrderByShipPeriod(shipPeriod, query)
      return record.length
    } catch (error) {
      this.logger.error(`count user order: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  async getUserOrderByShipPeriod(
    shipPeriodId: string,
    query = {},
    skip = 0,
    limit = 0,
  ): Promise<GoodsDocument[]> {
    const aggregate: any = [
      {
        $match: {
          shipPeriod: shipPeriodId,
          ...query,
        },
      },
      {
        $group: {
          _id: '$deliveryAddress._id',
          deliveryAddress: { $first: '$deliveryAddress' },
          user: { $first: '$user' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $skip: skip },
    ]

    if (limit > 0) {
      const limitOptions = {
        $limit: limit,
      }

      aggregate.push(limitOptions)
    }
    return this.goodsModule.aggregate(aggregate)
  }

  async countUsersTookGoodsByShipPeriod(shipPeriod): Promise<number> {
    try {
      const records = await this.goodsModule.aggregate([
        {
          $match: {
            shipPeriod,
            status: EStatusGoods.DELIVERED,
          },
        },
        {
          $group: {
            _id: '$user',
            count: { $sum: 1 },
          },
        },
      ])
      return sumBy(records, 'count')
    } catch (e) {
      this.logger.error(
        `count users took goods: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  exportQR(conditions: FilterQuery<GoodsDocument>) {
    return Promise.all([
      this.goodsModule
        .find(conditions)
        .select({
          qr: 1,
          objectId: 1,
        })
        .lean(),
      this.goodsModule.countDocuments(conditions),
    ])
  }
}
