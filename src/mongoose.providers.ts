import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'

import { DB_CONNECTION_NAME } from './constants'
import { DeliveryProviderSchema } from './modules/delivery-providers/delivery-provider.schema'
import { DeliveryProviders } from './modules/delivery-providers/delivery-provider.schema'
import { ImportRateSchema } from './modules/import-rate/import-rate.schema'
import { ImportRate } from './modules/import-rate/import-rate.schema'

export const models = [
  {
    name: DeliveryProviders.name,
    schema: DeliveryProviderSchema,
  },
  {
    name: ImportRate.name,
    schema: ImportRateSchema,
  },
]

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: DB_CONNECTION_NAME,
  useFactory: async (configService: ConfigService) =>
    ({
      uri: configService.get<string>('database.host'),
      ...configService.get<any>('database.options'),
    } as MongooseModuleAsyncOptions),
}
