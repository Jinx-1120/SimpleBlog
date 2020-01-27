/*
 * @Author: jinhaidi
 * @Date: 2019-10-06 17:00:10
 * @Description: 加密
 * @LastEditTime: 2019-10-06 17:01:04
 */
import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

// Base64 编码
export function decodeBase64(value: string): string {
  return value ? Base64.decode(value) : value
}

// md5 编码
export function decodeMd5(value: string): string {
  return createHash('md5').update(value).digest('hex')
}
