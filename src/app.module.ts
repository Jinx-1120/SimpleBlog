import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import { AssiteModule } from '@app/assite/assite.module'
import { DatabaseModule } from '@app/processors/database/database.module'
import { TagModule } from '@app/modules/tag/tag.module'
import { AuthModule } from '@app/modules/auth/auth.module'
import { HumanizedJwtAuthGuard } from './guards/humanized-auth.guard'

@Module({
  imports: [
    AssiteModule,
    DatabaseModule,
    AuthModule,
    TagModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
