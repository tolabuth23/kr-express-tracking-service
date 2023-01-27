import { EImportRate } from '../enums/importrate-query-key.enum'
import ImportRateUtil from '../index'

describe('import rate util', () => {
  it('import rate get query by key', () => {
    const restQuery = {
      isMInt: true,
    }
    const key = EImportRate.STATUS_ACTIVE
    const actual = ImportRateUtil.getQueryByKey(key, restQuery)
    expect(actual).toMatchObject({ isMInt: true, status: 'inactive' })
  })
})
