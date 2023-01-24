import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { DeliveryProviderModule } from '../delivery-providers/delivery-provider.module'
import { GoodsModule } from '../goods/goods.module'
import { HealthzModule } from '../healthz/healthz.module'
import { ImportRateModule } from '../import-rate/import-rate.module'

import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose.providers'
import { SequenceModule } from '../sequences/sequence.module'
import { ShipPeriodModule } from '../ship-period/ship-period.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    DeliveryProviderModule,
    GoodsModule.register(),
    ShipPeriodModule.register(),
    SequenceModule,
    HealthzModule,
    ImportRateModule,
  ],
})
export class AppModule {}
