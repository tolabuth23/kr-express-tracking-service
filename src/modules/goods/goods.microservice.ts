import { Controller, InternalServerErrorException } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import times from 'lodash/times'
import { UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import { ShipPeriodDocument } from '../ship-period/ship-period.schema'

import { OriginDestinationEnum } from './enums/origin-destination.enum'
import EStatusGoods from './enums/status-goods.enum'
import { Goods, GoodsDocument } from './goodsSchema'
import { GoodsService } from './goods.service'
import { IGoods } from './interfaces/goods.interface'
import { IPayloadDelivered } from './interfaces/payload-delivered.interface'
import { IPayloadInDestinationGoods } from './interfaces/payload-in-destination-goods.interface'
import { IPayloadRegisterGoods } from './interfaces/payload-register-goods.interface'

import { LoggerService } from '../logger/logger.service'

import { FindOptionsInterface } from '../../interfaces/find-optins.interface'
import {
  PaginationInterface,
  PaginationResponseInterface,
} from '../../interfaces/pageination.interface'
import Currency from '../../utils/Currency/index'
import QRCode from '../../utils/QRCode/index'

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
        `catch on goods get pagination: ${e?.message ?? JSON.stringify(e)}`,
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
      userId: string
    },
  ): Promise<GoodsDocument> {
    const { amount, userId } = payload
    try {
      const promises = await times(Number(amount), async () => {
        const createData = {
          ...payload,
          user: userId,
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
      return this.goodsService.create(qrCode)
    } catch (e) {
      this.logger.error(
        `catch on goods create: ${e?.message ?? JSON.stringify(e)}`,
      )
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
      goods: IGoods
      body: IPayloadRegisterGoods
    },
  ): Promise<GoodsDocument> {
    const { goods, body } = payload
    const { userId } = body
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
          userObjectId: userId,
        },
        origin: OriginDestinationEnum.JP,
        destination: OriginDestinationEnum.TH,
      }

      return this.goodsService.register(goods.objectId, registerBody)
    } catch (e) {
      this.logger.error(
        `catch on goods register: ${e?.message ?? JSON.stringify(e)}`,
      )
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
      goods: IGoods
      body: IPayloadInDestinationGoods
    },
  ): Promise<[GoodsDocument, ShipPeriodDocument]> {
    const { goods, body } = payload
    const { category, currencyUnit, weight, rate } = body

    const currencyInstance = new Currency({
      weight: weight,
      category: category.value,
      currencyRate: currencyUnit.value,
      cod: goods.cod,
      userRole: goods.user.level,
      rate: rate,
    })

    const registerBody: UpdateQuery<Goods> = {
      ...body,
      currency: currencyUnit,
      total: currencyInstance.getTotal(),
      status: EStatusGoods.IN_DESTINATION,
      destinationArrivedAt: new Date(),
      weighedAt: new Date(),
      importRate: currencyInstance.getImportRate(),
    }

    try {
      return this.goodsService.UpdateToInDestination(
        goods.objectId,
        goods.shipPeriod._id,
        registerBody,
      )
    } catch (e) {
      this.logger.error(
        `catch on goods update in destination: ${
          e?.message ?? JSON.stringify(e)
        }`,
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
      goods: IGoods
      body: IPayloadDelivered
    },
  ): Promise<UpdateWriteOpResult> {
    let registerBody: UpdateQuery<GoodsDocument>
    const { goods, body } = payload
    const {
      weight,
      category,
      currencyUnit,
      user,
      trackingNumber,
      cod,
      deliveryAddress,
    } = body

    const currencyInstance = new Currency({
      weight: weight,
      category: category.value,
      currencyRate: currencyUnit.value,
      cod: goods.cod,
      userRole: user.level,
    })

    if (goods.status === EStatusGoods.IN_DESTINATION) {
      registerBody = {
        user: user,
        trackingNumber: trackingNumber,
        cod: cod,
        weight: weight,
        category: category,
        currency: currencyUnit,
        deliveryAddress: deliveryAddress,
        total: currencyInstance.getTotal(),
        importRate: currencyInstance.getImportRate(),
        meta: {
          user: user.objectId,
        },
        status: EStatusGoods.DELIVERED,
        deliveredAt: new Date(),
        qr: null,
      }
    }

    registerBody.$set = {
      trackingProvider: body.trackingProvider,
      destinationTrackingNumber: body.destinationTrackingNumber,
      deliveryCost: body.deliveryCost,
    }

    try {
      return this.goodsService.delivered(goods.objectId, registerBody)
    } catch (e) {
      this.logger.error(
        `catch on goods delivered: ${e?.message ?? JSON.stringify(e)}`,
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
  async getByObjectId(@Payload() objectId: string): Promise<GoodsDocument> {
    try {
      return this.goodsService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(
        `catch on goods get by object: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @MessagePattern({
    cmd: 'goods',
    method: 'getByStatus',
  })
  async getByStatus(
    @Payload()
    payload: {
      objectId: string
      status: object
    },
  ): Promise<GoodsDocument> {
    const { objectId, status } = payload
    try {
      return this.goodsService.getByStatus(objectId, status)
    } catch (e) {
      this.logger.error(
        `catch on goods get by status: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
