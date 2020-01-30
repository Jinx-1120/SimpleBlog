/*
 * @Author: jinhaidi
 * @Date: 2019-08-26 09:41:03
 * @Description: 入口文件
 * @LastEditTime: 2020-01-30 21:57:54
 */
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as rateLimit from 'express-rate-limit'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from '@app/app.module'
import config from '@app/app.config'
import { isPro } from '@app/app.env'
import { HttpTransformInterceptor } from '@app/interceptors/transfrom.interceptor'
import { ErrorInterceptor } from '@app/interceptors/error.interceptor'
import { HttpExceptionFilter } from '@app/filters/error.filter'

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isPro ? {logger: false} : null
  )
  app.use(helmet())
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    new HttpTransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector())
  )
  await app.listen(config.port)
}
bootstrap()
