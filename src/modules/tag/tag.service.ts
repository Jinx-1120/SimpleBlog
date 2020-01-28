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
  public async getList(querys, options, isAuthenticated?): Promise<PaginateResult<Tag>> {
    return await this.tagModel.paginate(querys, options)
  }

  // 创建标签
  public async create(newTag: Tag): Promise<Tag> {
    const existedTags = await this.tagModel.find({ tagName: newTag.tagName }).exec()
    if (existedTags.length) {
      return Promise.reject('别名已被占用')
    } else {
      const createTag = new this.tagModel(newTag)
      return createTag.save()
    }
  }

  // 获取标签详情
  public getDetailBySlug(tagName: string): Promise<Tag> {
    return this.tagModel.findOne({ tagName }).exec()
  }

  // 修改标签
  public async update(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    try {
      const existedTag = await this.tagModel.findById(tagId)
      if (existedTag) {
        if (existedTag.tagName === newTag.tagName) return Promise.reject('标签名已被占用')
        return await this.tagModel.findByIdAndUpdate(tagId, newTag, { new: true }).exec()
      } else {
        return Promise.reject('当前修改tag不存在')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 删除单个标签
  public async delete(tagId: Types.ObjectId): Promise<boolean> {
    try {
      await this.tagModel.findByIdAndRemove(tagId).exec()
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 批量删除标签
  public async batchDelete(tagIds: Types.ObjectId[]): Promise<boolean> {
    try {
      await this.tagModel.find({ _id: { $in: tagIds } }).exec()
      await this.tagModel.deleteMany({ _id: { $in: tagIds } }).exec()
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
