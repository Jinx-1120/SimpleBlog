/*
 * auth module
 * @Author: jinhaidi
 * @Date: 2019-10-06 14:48:17
 * @Description: 用户模型
 * @LastEditTime: 2020-01-29 21:04:59
 */
import { prop, Typegoose, plugin } from 'typegoose'
import { IsString, IsDefined, IsNotEmpty, IsArray } from 'class-validator'
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform'
import { mongooseAutoIncrement } from '@app/transforms/mongose.transform'

export interface ITokenResult {
  access_token: string;
  expires_in: number;
}
@plugin(mongooseAutoIncrement.plugin, {
  model: Auth.name,
  field: '_id',
  startAt: 1,
  incrementBy: 1
})
export class Auth extends Typegoose {
  @IsDefined()
  @IsString({ message: '名字？' })
  @prop({ default: '' })
  name: string;

  @IsDefined()
  @IsString({ message: '你的口号呢？' })
  @prop({ default: '' })
  description: string;

  @IsDefined()
  @IsString({ message: '头像？' })
  @prop({ default: '' })
  gravatar: string;

  @IsString()
  @prop()
  password: string;

  @IsArray()
  @prop({ default: [] })
  friends?: any[]

  @IsArray()
  @prop({ default: [] })
  link?: any[]

  @IsString()
  newPassword?: string

}
// tslint:disable-next-line:max-classes-per-file
export class AuthLogin extends Typegoose {
  @IsDefined()
  @IsNotEmpty({ message: '帐号' })
  @IsString({ message: '字符串！' })
  name: string;

  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串！' })
  password: string;
}

export const AuthModel = getModelBySchema(Auth);
export const AuthProvider = getProviderByModel(AuthModel);
