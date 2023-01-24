import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'

import { GoodsMicroservice } from './goods.microservice'
import { GoodsService } from './goods.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'
import { models } from '../../mongoose.providers'
import { SequenceService } from '../sequences/sequence.service'
import { ShipPeriodService } from '../ship-period/ship-period.service'

export class GoodsModule {
  static register(): DynamicModule {
    return {
      module: GoodsModule,
      imports: [
        ClientsModule.register([MakeRMQServiceProvider(RMQService.User)]),
        MongooseModule.forFeature(models, DB_CONNECTION_NAME),
      ],
      controllers: [GoodsMicroservice],
      providers: [GoodsService, SequenceService, ShipPeriodService],
      exports: [GoodsModule, GoodsService],
    }
  }
}
