import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DeliveryProviderMicroservice } from './delivery-provider.microservice'
import { DeliveryProviderService } from './delivery-provider.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [DeliveryProviderMicroservice],
  providers: [DeliveryProviderService],
})
export class DeliveryProviderModule {}
