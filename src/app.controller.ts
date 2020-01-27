import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { AppService } from './app.service'
import { HttpProcessor } from '@app/decorators/http.decorator'

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @HttpProcessor.handle('获取服务')
  getHello() {
    return this.appService.getHello()
  }
  /**
   * @description: id
   * @param {type} id
   * @return: string
   */
  @Get('/test/:id')
  // @UseGuards(JwtAuthGuard)
  // @HttpProcessor.handle('添加id')
  getId(@Param('id') id) {
    return this.appService.getHello()
  }
}
