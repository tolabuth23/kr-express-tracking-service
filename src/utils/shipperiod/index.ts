import { EShipPeriodQueryKey } from './enums/ship-period-query-key.enum'

export class ShipPeriodUtil {
  static getQueryByKey(key: string, query?: Record<string, any>) {
    if (key === EShipPeriodQueryKey.ALL) {
      return query
    }
    if (key === EShipPeriodQueryKey.WAITING_TO_RECEIVE) {
      return { ...query, status: 'waiting-to-receive' }
    }
    if (key === EShipPeriodQueryKey.CREATED) {
      return { ...query, status: 'created' }
    }
    if (key === EShipPeriodQueryKey.REGISTERED) {
      return { ...query, status: 'registered' }
    }
    if (key === EShipPeriodQueryKey.IN_TRANSIT) {
      return { ...query, status: 'in-transit' }
    }
    if (key === EShipPeriodQueryKey.IN_DESTINATION) {
      return { ...query, status: 'in-destination' }
    }
    if (key === EShipPeriodQueryKey.DELIVERED) {
      return { ...query, status: 'delivered' }
    }
  }
}
