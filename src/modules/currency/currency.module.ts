import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ImportRateService } from '../import-rate/import-rate.service'

import { CurrencyMicroservice } from './currency.microservice'
import { CurrencyService } from './currency.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [CurrencyMicroservice],
  providers: [CurrencyService, ImportRateService],
})
export class CurrencyModule {}
