/**
 * Tag service.
 * @file 标签模块数据服务
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transforms/model.transform';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Tag } from '@app/modules/tag/tag.model';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag) private readonly tagModel: TMongooseModel<Tag>
  ) {}

  // 请求标签列表（及聚和数据）
  public getList(querys, options, isAuthenticated?): Promise<PaginateResult<Tag>> {

    return this.tagModel
      .paginate(querys, options)
      .then(tags => {
        return tags
      })
  }

  // 创建标签
  public create(newTag: Tag): Promise<Tag> {
    return this.tagModel
      .find({ name: newTag.name })
      .exec()
      .then(existedTags => {
        return existedTags.length
          ? Promise.reject('别名已被占用')
          : new this.tagModel(newTag)
            .save()
            .then(tag => {
              return tag
            })
      })
  }

  // 获取标签详情
  public getDetailBySlug(slug: string): Promise<Tag> {
    return this.tagModel.findOne({ slug }).exec()
  }

  // 修改标签
  public update(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    return this.tagModel
      .findOne({ name: newTag.name })
      .exec()
      .then(existedTag => {
        return existedTag && String(existedTag.id) !== String(tagId)
          ? Promise.reject('别名已被占用')
          : this.tagModel
            .findByIdAndUpdate(tagId, newTag, { new: true })
            .exec()
            .then(tag => {
              return tag
            })
      })
  }

  // 删除单个标签
  public delete(tagId: Types.ObjectId): Promise<Tag> {
    return this.tagModel
      .findByIdAndRemove(tagId)
      .exec()
      .then(() => {
        return {}
      })
  }

  // 批量删除标签
  public batchDelete(tagIds: Types.ObjectId[]): Promise<any> {
    return this.tagModel
      .find({ _id: { $in: tagIds } })
      .exec()
      .then(() => {
        return this.tagModel
          .deleteMany({ _id: { $in: tagIds } })
          .exec()
          .then(result => {
            return result
          })
      })
  }
}
