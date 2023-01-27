import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { MessagePattern } from '@nestjs/microservices'

import { CurrencyDocument } from './currency.schema'
import { CurrencyService } from './currency.service'

@Controller()
export class CurrencyMicroservice {
  constructor(private readonly currencyService: CurrencyService) {}

  @MessagePattern({
    cmd: 'currency',
    method: 'getByCurrencyUnit',
  })
  async getByCurrencyUnit(
    @Payload() currencyUnit: string,
  ): Promise<CurrencyDocument> {
    return this.currencyService.getByCurrencyUnit(currencyUnit)
  }
}
