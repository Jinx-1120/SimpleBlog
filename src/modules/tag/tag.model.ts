/*
 * @Author: jinhaidi
 * @Date: 2019-10-07 12:31:37
 * @Description: 标签模型
 * @LastEditTime: 2020-01-28 21:20:50
 */

import { Types } from 'mongoose'
import { prop, arrayProp, plugin, pre, Typegoose } from 'typegoose'
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongose.transform'
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform'

@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Tag.name,
  field: '_id',
  startAt: 1,
  incrementBy: 1
})
export class Tag extends Typegoose {
  @IsNotEmpty({ message: '标签名称？'})
  @IsString({message: '字符串？'})
  @prop({ required: true, validate: /\S+/})
  tagName: string

  @IsString({ message: '字符串？' })
  @prop({default: ''})
  description: string

  @prop({ default: new Date() })
  createTime?: Date

  @prop({ default: new Date() })
  updateTime?: Date

  @prop({ default: 0})
  count?: number
}
export class DelTags extends Typegoose {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: Types.ObjectId[];
}

export const TagModel = getModelBySchema(Tag)
export const TagProvider = getProviderByModel(TagModel)
