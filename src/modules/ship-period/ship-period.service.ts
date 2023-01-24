import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { sumBy } from 'lodash'
import pick from 'lodash/pick'
import { FilterQuery, LeanDocument, Model, UpdateWriteOpResult } from 'mongoose'
import { lastValueFrom } from 'rxjs'

import EStatusShip from './enum/status-ship.enum'
import { IPayloadShipPeriod } from './interface/payload-ship-period.interface'
import { ShipPeriod, ShipPeriodDocument } from './ship-period.schema'

import { GoodsDocument } from '../goods/goodsSchema'
import { GoodsService } from '../goods/goods.service'
import { LoggerService } from '../logger/logger.service'

import { RMQService } from '../../microservice.constants'
import EStatusGoods from '../goods/enums/status-goods.enum'

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

  async getByObjectId(objectId: string): Promise<ShipPeriodDocument> {
    return this.shipPeriodModel.findOne({ objectId })
  }

  async register(endAt: Date, value: number): Promise<ShipPeriodDocument> {
    try {
      const shipPeriod = new this.shipPeriodModel({
        endAt,
        runningNumber: value,
      })
      return shipPeriod.save()
    } catch (error) {
      this.logger.error(`ShipPeriod: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  async getPagination(
    conditions: FilterQuery<ShipPeriod>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ): Promise<[ShipPeriod[], number]> {
    const { page = 1, perPage = 20 } = pagination

    const [count, recordShipPeriods] = await Promise.all([
      this.shipPeriodModel.count(conditions as ShipPeriod),
      this.shipPeriodModel
        .find(conditions as ShipPeriod)
        .select(select)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .sort(sort)
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
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.shipPeriodModel.countDocuments(conditions),
    ])
  }

  async updateToInTransit(
    shipPeriod: IPayloadShipPeriod,
  ): Promise<[LeanDocument<ShipPeriodDocument>, UpdateWriteOpResult]> {
    return Promise.all([
      this.shipPeriodModel
        .findOneAndUpdate(
          { objectId: shipPeriod.objectId },
          {
            status: EStatusShip.IN_TRANSIT,
          },
        )
        .lean(),
      this.goodsService
        .getModel()
        .updateMany(
          { shipPeriod: shipPeriod._id },
          {
            status: EStatusGoods.IN_TRANSIT,
          },
        )
        .lean(),
    ])
  }

  async updateToInDestination(
    shipPeriod: IPayloadShipPeriod,
  ): Promise<UpdateWriteOpResult> {
    return this.shipPeriodModel.updateOne(
      { objectId: shipPeriod.objectId },
      { status: EStatusShip.IN_DESTINATION },
    )
  }

  async getUserOrder(
    shipPeriod: ShipPeriodDocument,
    conditions: FilterQuery<GoodsDocument>,
    pagination?: { page: number; perPage: number },
  ): Promise<[ShipPeriod[], number]> {
    const { page = 1, perPage = 20 } = pagination
    const records = []
    try {
      const [userOrders, count] = await Promise.all([
        this.goodsService.getUserOrderByShipPeriod(
          shipPeriod._id,
          conditions,
          (page - 1) * +perPage,
          perPage,
        ),
        this.goodsService.countUserOrderByShipPeriod(
          shipPeriod._id,
          conditions,
        ),
      ])

      for (const userOrder of userOrders) {
        const [user, goodsInDestination] = await Promise.all([
          lastValueFrom(
            this.userService
              .send(
                { cmd: 'user', method: 'getByObjectId' },
                userOrder.user.objectId,
              )
              .pipe(),
          ),
          this.goodsService.getGoodsInDestinationByShipPeriod(shipPeriod._id, {
            user: userOrder.user,
            'deliveryAddress._id': userOrder._id,
          }),
        ])
        const obj = {
          ...pick(user, ['objectId', 'phoneNumber']),
          paymentAmount: sumBy(goodsInDestination, 'total'),
          originGoodsReceive: userOrders.length,
          deliveryAddress: userOrder.deliveryAddress,
          goodsInDestination: goodsInDestination.length,
        }
        records.push(obj)
      }

      return Promise.all([records, count])
    } catch (error) {
      this.logger.error(`ShipPeriod: ${error.message ?? error}`)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
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
