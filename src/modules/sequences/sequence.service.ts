import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Sequence, sequenceDocument } from './sequence.schema'
import { Model } from 'mongoose'

@Injectable()
export class SequenceService {
  constructor(
    @InjectModel(Sequence.name) private sequenceModel: Model<sequenceDocument>,
  ) {}
  async getSequence(key: string) {
    const seq = await this.sequenceModel.findOne({ key })
    if (seq) {
      return seq
    }
    return this.getNextSequence(key)
  }
  async getNextSequence(key: string): Promise<sequenceDocument> {
    return this.sequenceModel
      .findOneAndUpdate({ key }, { $inc: { value: 1 } }, { new: true })
      .lean()
  }
}
