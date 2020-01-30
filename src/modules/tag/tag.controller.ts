import * as lodash from 'lodash'
import { PaginateResult } from 'mongoose'
import { Controller, Get, Put, Post, Delete, Body, UseGuards, Req } from '@nestjs/common'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { Tag, DelTags } from './tag.model'
import { TagService } from './tag.service'
import { JwtAuthGuard } from '@app/guards/auth.guard'

@Controller('/tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取标签')
  getTags(@Req() req): Promise<PaginateResult<Tag>> {
    const querys = req.query
    const keyword = lodash.trim(req.query.keyword)
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i')
      Reflect.deleteProperty(querys, 'keyword')
      querys.$or = [
        { tagName: keywordRegExp },
        { description: keywordRegExp }
      ]
    }
    return this.tagService.getList(querys, {})
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加标签')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除标签')
  delTags(@Body() body: DelTags): Promise<any> {
    return this.tagService.batchDelete(body.tag_ids)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改标签')
  putTag(@QueryParams() { params }, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(params.id, tag)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个标签')
  delTag(@QueryParams() { params }): Promise<boolean> {
    return this.tagService.delete(params.id)
  }
}
