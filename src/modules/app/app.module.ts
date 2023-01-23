import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { DeliveryProviderModule } from '../delivery-providers/delivery-provider.module'
import { HealthzModule } from '../healthz/healthz.module'
import { ImportRateModule } from '../import-rate/import-rate.module'

import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose.providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    DeliveryProviderModule,
    HealthzModule,
    ImportRateModule,
  ],
})
export class AppModule {}
