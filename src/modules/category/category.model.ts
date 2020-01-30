/**
 * Category model.
 * @file 分类模块数据模型
 * @module module/category/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, Typegoose } from 'typegoose';
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongose.transform';
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform';
import { Extend } from '@app/models/extends.model';

@pre<Category>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { updateTime: Date.now() });
  next();
})

@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Category.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

export class Category extends Typegoose {

  @IsNotEmpty({ message: '分类名称？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '分类别名？' })
  @IsString({ message: '字符串？' })
  @MaxLength(30)
  @prop({ required: true, validate: /\S+/ })
  slug: string;

  @IsString({ message: '字符串？' })
  @prop()
  description: string;

  @prop({ ref: Category, default: null })
  pid: Types.ObjectId;

  @prop({ default: Date.now })
  createTime?: Date;

  @prop({ default: Date.now })
  updateTime?: Date;

  @IsArray()
  @ArrayUnique()
  @arrayProp({ items: Extend })
  extends: Extend[];

  count?: number;
}

export class DelCategories extends Typegoose {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  categorie_ids: Types.ObjectId[];
}

export const CategoryModel = getModelBySchema(Category);
export const CategoryProvider = getProviderByModel(CategoryModel);
