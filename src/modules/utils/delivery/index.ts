import { EDeliveryQueryKey } from './enums/delivery-providers-query-key.enum'

class DeliveryUtil {
  static getQueryByKey(key: string, query?: Record<string, any>) {
    if (key === EDeliveryQueryKey.ALL) {
      return query
    }
    if (key === EDeliveryQueryKey.IS_REQUIRED_TRACKING_ID) {
      return { ...query, requiredTrackingId: true }
    }
    if (key === EDeliveryQueryKey.IS_NOT_REQUIRED_TRACKING_ID) {
      return { ...query, requiredTrackingId: false }
    }
  }
}

export default DeliveryUtil
