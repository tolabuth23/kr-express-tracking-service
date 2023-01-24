import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DB_CONNECTION_NAME } from '../../constants'
import { models } from '../../mongoose.providers'

import { SequenceService } from './sequence.service'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
