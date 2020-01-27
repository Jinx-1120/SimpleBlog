/*
 * @Author: jinhaidi
 * @Date: 2019-10-06 13:36:54
 * @Description: 协助模块 邮箱、seo、ip等
 * @LastEditTime: 2020-01-25 21:04:47
 */
import { Module, Global, HttpModule } from '@nestjs/common'
import { EmailService } from './email.service'

@Global()
@Module({
  imports: [HttpModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class AssiteModule {}
