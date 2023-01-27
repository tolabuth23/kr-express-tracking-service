class GoodsUtil {
  static findGoodsGroup(shipPeriodId: string) {
    return [
      { $sort: { createdAt: -1 } },
      {
        $match: {
          shipPeriodId,
        },
      },
      {
        $lookup: {
          from: 'ship-periods',
          pipeline: [{ $match: { _id: shipPeriodId } }],
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
