import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ImportRateMicroservice } from './import-rate.microservice'
import { ImportRateService } from './import-rate.service'

import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [ImportRateMicroservice],
  providers: [ImportRateService],
  exports: [ImportRateModule, ImportRateService],
})
export class ImportRateModule {}
