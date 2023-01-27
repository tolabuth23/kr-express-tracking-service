import { Module } from '@nestjs/common'

import { CategoryService } from './category.service'

import { ImportRateModule } from '../import-rate/import-rate.module'

@Module({
  imports: [ImportRateModule],
  providers: [CategoryService],
})
export class CategoryModule {}
