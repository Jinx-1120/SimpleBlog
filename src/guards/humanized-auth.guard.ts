/*
 * @Author: jinhaidi
 * @Date: 2019-10-08 10:17:11
 * @Description: 智能鉴权卫士
 * @LastEditTime: 2020-01-30 17:33:49
 */

import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { HttpUnauthorizedException } from '@app/errors'

/**
 * @class HumanizedJwtAuthGuard
 * @classdesc 检验规则：Token 不存在 | Token 存在且有效
 * @example @UseGuards(HumanizedJwtAuthGuard)
 */
@Injectable()
export class HumanizedJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  /**
   * @function handleRequest
   * @description 如果 Token 不存在或 Token 存在并有效，都是通行
   */
  handleRequest(error, authInfo, errInfo) {
    const okToken = !!authInfo
    const noToken = !authInfo && errInfo && (errInfo.message === 'No auth token')
    if (!error && (okToken || noToken)) {
      return authInfo
    } else {
      throw error || new HttpUnauthorizedException(null, errInfo && errInfo.message)
    }
  }
}
