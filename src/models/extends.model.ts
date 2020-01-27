/*
 * @Author: jinhaidi
 * @Date: 2019-10-07 12:38:52
 * @Description: 通用模型
 * @LastEditTime: 2019-10-07 12:39:42
 */
import { prop } from 'typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class Extend {
  @IsNotEmpty()
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  name: string

  @IsNotEmpty()
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  value: string
}
