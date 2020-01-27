/*
 * @Author: jinhaidi
 * @Date: 2019-10-06 16:13:54
 * @Description: HTTP 响应接口模型
 * @LastEditTime: 2020-01-27 21:42:23
 */

// 响应状态
export enum EHttpStatus {
  Error = 'error',
  Success = 'success',
}

export type TMessage = string;
export type TExceptionOption = TMessage | {
  message: TMessage;
  error?: any
};

// 翻页数据
export interface IHttpResultPaginate<T> {
  data: T;
  pagination: {
    total: number,
    current_page: number,
    total_page: number,
    per_page: number
  };
}

// HTTP 状态返回
export interface IHttpResponseBase {
  status: EHttpStatus;
  message: TMessage;
}

// HTTP error
export type THttpErrorResponse = IHttpResponseBase & {
  error: any;
  debug?: string
};

// HTTP success 返回
export type THttpSuccessResponse<T> = IHttpResponseBase & {
  result: T | IHttpResultPaginate<T>;
};

// HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;
