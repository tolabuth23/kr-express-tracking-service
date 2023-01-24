import { EDeliveryQueryKey } from '../enums/delivery-providers-query-key.enum'
import DeliveryUtil from '../index'

describe('delivery providers util', () => {
  it('delivery providers get query by key', () => {
    const restQuery = {
      isMInt: true,
    }
    const key = EDeliveryQueryKey.IS_REQUIRED_TRACKING_ID
    const actual = DeliveryUtil.getQueryByKey(key, restQuery)
    expect(actual).toMatchObject({ isMInt: true, requiredTrackingId: true })
  })
})
