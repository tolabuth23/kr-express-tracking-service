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
import { Goods, GoodsDocument } from './goodsSchema'

import { LoggerService } from '../logger/logger.service'
import EStatusShip from '../ship-period/enum/status-ship.enum'
import { ShipPeriodDocument } from '../ship-period/ship-period.schema'
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
        .populate('user', ['objectId', 'level', 'displayName'])
        .populate('shipPeriod', ['objectId', 'endAt'])
        .select(select)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .sort(sort)
        .lean(),
      this.goodsModule.count(conditions),
    ])
  }

  async create(qrCode: object): Promise<GoodsDocument> {
    return this.goodsModule.create(qrCode)
  }

  async register(
    objectId: string,
    registerBody: UpdateQuery<GoodsDocument>,
  ): Promise<GoodsDocument> {
    return this.goodsModule.findOneAndUpdate({ objectId }, registerBody, {
      new: true,
    })
  }

  async getByStatus(objectId: string, status: object): Promise<GoodsDocument> {
    return this.goodsModule
      .findOne({
        objectId: objectId,
        status: status,
      })
      .select({ qr: 0 })
      .populate('user', ['level'])
      .lean()
  }

  async getByObjectId(objectId: string): Promise<GoodsDocument> {
    return this.goodsModule
      .findOne({
        objectId,
      })
      .select({ qr: 0 })
      .lean()
  }

  async getOneGoods(objectId: string): Promise<GoodsDocument> {
    return this.goodsModule
      .findOne({ objectId: objectId })
      .populate('user', ['objectId', 'level', 'displayName'])
      .populate('shipPeriod', ['objectId', 'status', 'endAt'])
      .lean()
  }

  async UpdateToInDestination(
    objectId: string,
    _id: string,
    update: UpdateQuery<GoodsDocument>,
  ): Promise<[GoodsDocument, ShipPeriodDocument]> {
    return Promise.all([
      this.goodsModule.findOneAndUpdate({ objectId }, update, {
        new: true,
      }),
      this.shipPeriodService
        .getModel()
        .findOneAndUpdate({ _id }, { status: EStatusShip.IN_DESTINATION }),
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
    query = {},
  ): Promise<GoodsDocument[]> {
    return this.goodsModule
      .find({
        _id: shipPeriodId,
        status: {
          $in: [EStatusGoods.IN_DESTINATION, EStatusGoods.DELIVERED],
          ...query,
        },
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
          shipPeriodId,
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
}
