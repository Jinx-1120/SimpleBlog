/*
 * @Author: jinhaidi
 * @Date: 2019-10-06 16:06:37
 * @Description: http错误
 * @LastEditTime: 2020-01-27 14:00:52
 */
import { UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common'
import { TMessage, TExceptionOption } from '@app/interfaces/http.interface'

/**
 * @description: 401 未授权
 */
export class HttpUnauthorizedException extends UnauthorizedException {
  constructor(message?: TMessage, error?: any) {
    super(message || '权限验证失败', error)
  }
}
/**
 * @description: 403
 */
export class HttpForbiddenError extends HttpException {
  constructor(error?: any) {
    super(error || '无权使用参数', HttpStatus.FORBIDDEN);
  }
}

/**
 * @description: 400
 */
export class HttpBadRequestError extends HttpException {
  constructor(error?: any) {
    super(error || '未知错误', HttpStatus.BAD_REQUEST);
  }
}

/**
 * @description: 500 系统错误
 */
export class CustomError extends HttpException {
  constructor(options: TExceptionOption, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @description: 400 参数校验失败
 */
export class ValidationError extends HttpException {
  constructor(error?: any) {
    super(error || '参数验证失败', HttpStatus.BAD_REQUEST);
  }
}
