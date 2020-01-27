/*
 * @Author: jinhaidi
 * @Date: 2019-10-07 13:20:02
 * @Description: 用于全局装饰器元信息的常量键
 * @LastEditTime: 2019-10-07 13:20:51
 */

import * as constants from '@nestjs/common/constants'
import { CACHE_KEY_METADATA } from '@nestjs/common/cache/cache.constants'

export const HTTP_ERROR_CODE = '__customHttpErrorCode__'
export const HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA

export const HTTP_MESSAGE = '__customHttpMessage__'
export const HTTP_ERROR_MESSAGE = '__customHttpErrorMessage__'
export const HTTP_SUCCESS_MESSAGE = '__customHttpSuccessMessage__'

export const HTTP_RES_TRANSFORM_PAGINATE = '__customHttpResTransformPagenate__'

export const HTTP_CACHE_KEY_METADATA = CACHE_KEY_METADATA
export const HTTP_CACHE_TTL_METADATA = '__customHttpCacheTTL__'
