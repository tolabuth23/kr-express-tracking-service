import { EImportRate } from './enums/importrate-query-key.enum'

class ImportRateUtil {
  static getQueryByKey(key: string, query?: Record<string, any>) {
    if (key === EImportRate.ALL) {
      return query
    }
    if (key === EImportRate.STATUS_ACTIVE) {
      return { ...query, status: 'active' }
    }
    if (key === EImportRate.STATUS_INACTIVE) {
      return { ...query, status: 'inactive' }
    }
  }
}
export default ImportRateUtil
