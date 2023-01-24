import { FilterQuery } from 'mongoose'

export interface FindOptionsInterface<T> {
  filter: FilterQuery<T>
  select: Record<string, number>
  sort: Record<string, number>
  limit?: number
}
