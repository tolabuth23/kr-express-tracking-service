import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'

import { DB_CONNECTION_NAME } from './constants'
import { Currency, CurrencySchema } from './modules/currency/currencySchema'
import { DeliveryProviderSchema } from './modules/delivery-providers/delivery-provider.schema'
import { DeliveryProviders } from './modules/delivery-providers/delivery-provider.schema'
import { Goods, GoodsSchema } from './modules/goods/goodsSchema'
import { ImportRateSchema } from './modules/import-rate/import-rate.schema'
import { ImportRate } from './modules/import-rate/import-rate.schema'
import { Sequence, SequenceSchema } from './modules/sequences/sequence.schema'
import {
  ShipPeriod,
  ShipPeriodSchema,
} from './modules/ship-period/ship-period.schema'

export const models = [
  {
    name: DeliveryProviders.name,
    schema: DeliveryProviderSchema,
  },
  {
    name: Goods.name,
    schema: GoodsSchema,
  },
  {
    name: Currency.name,
    schema: CurrencySchema,
  },
  {
    name: Sequence.name,
    schema: SequenceSchema,
  },
  {
    name: ImportRate.name,
    schema: ImportRateSchema,
  },
  {
    name: ShipPeriod.name,
    schema: ShipPeriodSchema,
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
