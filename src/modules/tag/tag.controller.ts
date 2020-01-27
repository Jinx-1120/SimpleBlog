import * as lodash from 'lodash'
import { PaginateResult } from 'mongoose'
import { Controller, Get, Put, Post, Delete, Body } from '@nestjs/common'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { Tag, DelTags } from './tag.model'
import { TagService } from './tag.service'

@Controller('/tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取标签')
  getTags(@QueryParams() { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Tag>> {
    const keyword = lodash.trim(origin.keyword)
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i')
      querys.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp }
      ]
    }
    return this.tagService.getList(querys, options)
  }

  @Post()
  @HttpProcessor.handle('添加标签')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag)
  }

  @Delete()
  @HttpProcessor.handle('批量删除标签')
  delTags(@Body() body: DelTags): Promise<any> {
    return this.tagService.batchDelete(body.tag_ids)
  }

  @Put(':id')
  @HttpProcessor.handle('修改标签')
  putTag(@QueryParams() { params }, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(params.id, tag)
  }

  @Delete(':id')
  @HttpProcessor.handle('删除单个标签')
  delTag(@QueryParams() { params }): Promise<Tag> {
    return this.tagService.delete(params.id)
  }
}
