import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { PaginateResult } from 'mongoose';
import { NestInterceptor, ExecutionContext, CallHandler, Inject, Injectable, RequestMethod } from '@nestjs/common';
import { Observable } from 'rxjs';
import { THttpSuccessResponse, TMessage, EHttpStatus, IHttpResultPaginate } from '@app/interfaces/http.interface';
import { HTTP_SUCCESS_MESSAGE, HTTP_RES_TRANSFORM_PAGINATE } from '@app/constants/meta.constant';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): IHttpResultPaginate<T[]> {
  return {
    data: data.docs,
    pagination: {
      total: data.total,
      current_page: data.page,
      total_page: data.pages,
      per_page: data.limit
    }
  };
}

@Injectable()
export class HttpTransformInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>> {
    const call$ = next.handle();
    const target = context.getHandler();
    const request = context.switchToHttp().getRequest();
    const ip = (
      (request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.ip ||
        request.ips[0]) as string
    ).replace('::ffff:', '');
    const message = this.reflector.get<TMessage>(HTTP_SUCCESS_MESSAGE, target) || 'success';
    const usePaginate = this.reflector.get<boolean>(HTTP_RES_TRANSFORM_PAGINATE, target);
    return call$.pipe(map((data: any) => {
      const result = !usePaginate ? data : transformDataToPaginate<T>(data, request);
      return { status: EHttpStatus.Success, message, result };
    }));
  }
}
