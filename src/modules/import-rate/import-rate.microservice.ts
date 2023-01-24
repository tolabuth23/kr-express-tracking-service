import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ImportRateService } from './import-rate.service'

@Controller()
export class ImportRateMicroservice {
  constructor(private readonly importRateService: ImportRateService) {}

  @MessagePattern({
    cmd: 'import-rate',
    method: 'getByObjectId',
  })
  async getByObjectId(@Payload() objectId: string) {
    return this.importRateService.getOneImportRates(objectId)
  }
}
