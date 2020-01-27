/*
 * @Author: jinhaidi
 * @Date: 2019-10-04 20:44:31
 * @Description: 全局数据库
 * @LastEditTime: 2020-01-25 21:08:08
 */

import { Module, Global } from '@nestjs/common'
import { databaseProvider } from './databbase.provider'

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider]
})
export class DatabaseModule {}
