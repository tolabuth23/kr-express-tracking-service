import { Controller, InternalServerErrorException } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import times from 'lodash/times'
import { UpdateQuery } from 'mongoose'

import { OriginDestinationEnum } from './enums/origin-destination.enum'
import EStatusGoods from './enums/status-goods.enum'
import { Goods, GoodsDocument } from './goods.schema'
import { GoodsService } from './goods.service'
import { GoodsInterface } from './interfaces/goods.interface'
import { IPayloadDelivered } from './interfaces/payload-delivered.interface'
import { IPayloadInDestinationGoods } from './interfaces/payload-in-destination-goods.interface'
import { IPayloadRegisterGoods } from './interfaces/payload-register-goods.interface'

import { LoggerService } from '../logger/logger.service'
import Currency from '../utils/Currency/index'
import QRCode from '../utils/QRCode/index'

import { FindOptionsInterface } from '../../interfaces/find-optins.interface'
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../../interfaces/pageination.interface'
import { IUser } from './interfaces/user.interface'

@Controller('goods')
export class GoodsMicroservice {
  private readonly logger: LoggerService = new LoggerService(
    GoodsMicroservice.name,
  )

  constructor(private readonly goodsService: GoodsService) {}

  @MessagePattern({
    cmd: 'goods',
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<GoodsDocument>,
  ): Promise<PaginationResponseInterface<Goods>> {
    const { filter, page, perPage, select, sort } = payload
    try {
      const [records, count] = await this.goodsService.getPagination(
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
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'create',
  })
  async create(
    @Payload()
    payload: {
      amount: number
      user: string
    },
  ): Promise<void> {
    const { amount, user } = payload
    try {
      const promises = await times(Number(amount), async () => {
        const createData = {
          ...payload,
          user,
        }

        const qrCodeInstance = new QRCode({ data: createData })
        const qr = await qrCodeInstance.getQR()
        return new Promise((resolve) => {
          resolve({
            ...createData,
            qr,
          })
        })
      })

      const qrCode = await Promise.all(promises)
      await this.goodsService.create(qrCode)
    } catch (e) {
      this.logger.error(`catch on create: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'register',
  })
  async register(
    @Payload()
    payload: {
      goods: GoodsInterface
      body: IPayloadRegisterGoods
    },
  ): Promise<void> {
    const { goods, body } = payload
    const { user } = body
    const originArrivedAt =
      goods?.status === EStatusGoods.REGISTERED
        ? goods.originArrivedAt
        : new Date()
    try {
      const registerBody = {
        ...body,
        status: EStatusGoods.REGISTERED,
        originArrivedAt,
        meta: {
          userObjectId: user,
        },
        origin: OriginDestinationEnum.JP,
        destination: OriginDestinationEnum.TH,
      }

      await this.goodsService.register(goods.objectId, registerBody)
    } catch (e) {
      this.logger.error(`catch on register: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'UpdateToInDestination',
  })
  async UpdateToInDestination(
    @Payload()
    payload: {
      goods: GoodsInterface
      body: IPayloadInDestinationGoods
      user: IUser
    },
  ): Promise<void> {
    const { goods, body, user } = payload
    const { categories, currency, weight, rate } = body

    const currencyInstance = new Currency({
      weight: weight,
      category: categories.value,
      currencyRate: currency.value,
      cod: goods.cod,
      userRole: user.level,
      rate: rate,
    })

    const registerBody: UpdateQuery<Goods> = {
      ...body,
      category: categories.objectId,
      currency: currency,
      total: currencyInstance.getTotal(),
      status: EStatusGoods.IN_DESTINATION,
      destinationArrivedAt: new Date(),
      weighedAt: new Date(),
      importRate: currencyInstance.getImportRate(),
    }

    try {
      await this.goodsService.UpdateToInDestination(
        goods.objectId,
        goods.shipPeriod,
        registerBody,
      )
    } catch (e) {
      this.logger.error(
        `catch on update in-destination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'delivered',
  })
  async delivered(
    @Payload()
    payload: {
      goods: GoodsInterface
      body: IPayloadDelivered
    },
  ): Promise<void> {
    let registerBody: UpdateQuery<GoodsDocument>
    const { goods, body } = payload
    const {
      weight,
      categories,
      currency,
      users,
      trackingNumber,
      cod,
      deliveryAddress,
    } = body

    const currencyInstance = new Currency({
      weight: weight,
      category: categories.value,
      currencyRate: currency.value,
      cod: goods.cod,
      userRole: users.level,
    })
    if (goods.status === EStatusGoods.IN_DESTINATION) {
      registerBody = {
        user: users.objectId,
        trackingNumber: trackingNumber,
        cod: cod,
        weight: weight,
        category: categories.objectId,
        currency: currency,
        deliveryAddress: deliveryAddress,
        total: currencyInstance.getTotal(),
        importRate: currencyInstance.getImportRate(),
        meta: {
          user: users.objectId,
        },
        status: EStatusGoods.DELIVERED,
        deliveredAt: new Date(),
        qr: null,
      }
    }

    registerBody.$set = {
      trackingProvider: body.trackingProviders,
      destinationTrackingNumber: body.destinationTrackingNumber,
      deliveryCost: body.deliveryCost,
    }

    try {
      await this.goodsService.delivered(goods.objectId, registerBody)
    } catch (e) {
      this.logger.error(
        `catch on delivered: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'getByTrackingNumber',
  })
  async getByTrackingNumber(
    @Payload() trackingNumber: string,
  ): Promise<GoodsDocument> {
    try {
      return this.goodsService.getByTrackingNumber(trackingNumber)
    } catch (e) {
      this.logger.error(
        `catch on getByTrackingNumber: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'getByObjectId',
  })
  async getByObjectId(
    @Payload() payload: { objectId: string; query: object },
  ): Promise<GoodsDocument> {
    const { objectId, query } = payload
    try {
      return this.goodsService.getByObjectId(objectId, query)
    } catch (e) {
      this.logger.error(
        `catch on getByObject: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'getByShipPeriod',
  })
  async getByShipPeriod(
    @Payload() payload: { shipPeriodId: string; query: object },
  ): Promise<GoodsDocument[]> {
    const { shipPeriodId, query } = payload
    try {
      return this.goodsService.getByShipPeriod(shipPeriodId, query)
    } catch (e) {
      this.logger.error(
        `catch on getByObject: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'exportQR',
  })
  async exportQR(@Payload() payload) {
    return this.goodsService.exportQR(payload)
  }
}
