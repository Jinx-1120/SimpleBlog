/*
 * @Author: jinhaidi
 * @Date: 2019-10-07 13:10:31
 * @Description: 鉴权
 * @LastEditTime: 2020-01-30 22:19:20
 */
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { HttpUnauthorizedException } from '@app/errors'

/**
 * @class JwtAuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  /**
   * @function handleRequest
   * @description 如果解析出的数据对不上，则判定为无效
   */
  handleRequest(error, authInfo, errInfo) {
    if (authInfo && !error && !errInfo) {
      return authInfo
    } else {
      throw new HttpUnauthorizedException(null, errInfo && errInfo.message)
    }
  }
}
