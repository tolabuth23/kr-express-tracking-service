import { InternalServerErrorException } from '@nestjs/common'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { LoggerService } from '../logger/logger.service'

import {
  DeliveryProviders,
  DeliveryProvidersDocument,
} from './delivery-provider.schema'
import { deliveryProvidersIntiData } from './init/delivery-providers.init'

@Injectable()
export class DeliveryProviderService implements OnModuleInit {
  private readonly logger: LoggerService = new LoggerService(
    DeliveryProviderService.name,
  )

  @InjectModel(DeliveryProviders.name)
  private readonly deliveryProvidersModule: Model<DeliveryProvidersDocument>

  async getPagination(
    conditions: FilterQuery<DeliveryProvidersDocument>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
    select = {},
  ) {
    const { page = 1, perPage = 20 } = pagination

    return Promise.all([
      this.deliveryProvidersModule
        .find(conditions)
        .select(select)
        .skip((Number(page) - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.deliveryProvidersModule.count(conditions),
    ])
  }

  async getByObjectId(objectId: string) {
    return this.deliveryProvidersModule.findOne({ objectId }).lean()
  }

  async onModuleInit() {
    const providers = await this.deliveryProvidersModule.count()
    if (!providers) {
      for (const i of deliveryProvidersIntiData) {
        const deliveryProviders = new this.deliveryProvidersModule({
          title: i.title,
          requiredTrackingId: i.requiredTrackingId,
        })
        try {
          await deliveryProviders.save()
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
