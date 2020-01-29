import { Module } from '@nestjs/common'
// import { SitemapModule } from '@app/modules/sitemap/sitemap.module'
// import { ArticleProvider } from '@app/modules/article/article.model'
import { TagController } from '@app/modules/tag/tag.controller'
import { TagProvider } from '@app/modules/tag/tag.model'
import { TagService } from '@app/modules/tag/tag.service'

@Module({
  // imports: [SitemapModule],
  controllers: [TagController],
  providers: [TagProvider, TagService],
  exports: [TagService]
})
export class TagModule { }
