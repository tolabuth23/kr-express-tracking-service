import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { MessagePattern } from '@nestjs/microservices'
import { DeliveryProviderService } from './delivery-provider.service'

@Controller('delivery-providers')
export class DeliveryProviderMicroservice {
  constructor(
    private readonly deliveryProvidersService: DeliveryProviderService,
  ) {}

  @MessagePattern({
    cmd: 'delivery-providers',
    method: 'getByObjectId',
  })
  async getByObjectId(@Payload() objectId: string) {
    return this.deliveryProvidersService.getByObjectId(objectId)
  }
}
