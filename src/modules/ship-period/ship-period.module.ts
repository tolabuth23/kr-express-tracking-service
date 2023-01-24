import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'

import { ShipPeriodMicroservice } from './ship-period.microservice'
import { ShipPeriodService } from './ship-period.service'

import { GoodsService } from '../goods/goods.service'
import { SequenceService } from '../sequences/sequence.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'
import { models } from '../../mongoose.providers'

export class ShipPeriodModule {
  static register(): DynamicModule {
    return {
      module: ShipPeriodModule,
      imports: [
        ClientsModule.register([MakeRMQServiceProvider(RMQService.User)]),
        MongooseModule.forFeature(models, DB_CONNECTION_NAME),
      ],
      controllers: [ShipPeriodMicroservice],
      providers: [ShipPeriodService, SequenceService, GoodsService],
      exports: [ShipPeriodService],
    }
  }
}
