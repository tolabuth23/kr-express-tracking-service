import { Types } from 'mongoose'

class GoodsUtil {
  static findGoodsGroup(shipPeriodId) {
    const shipPeriod = Types.ObjectId(shipPeriodId)
    return [
      { $sort: { createdAt: -1 } },
      {
        $match: {
          shipPeriod,
        },
      },
      {
        $lookup: {
          from: 'ship-periods',
          pipeline: [{ $match: { _id: shipPeriod } }],
          as: 'shipPeriod',
        },
      },
      {
        $group: {
          _id: '$shipPeriod',
          shipPeriod: {
            $push: {
              endAt: '$shipPeriod.endAt',
            },
          },
          goods: {
            $push: {
              trackingNumber: '$trackingNumber',
              weight: '$weight',
              importRate: '$importRate.rate',
              total: '$total',
            },
          },
          total: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $project: { 'user.password': 0 } },
    ]
  }
}

export default GoodsUtil
