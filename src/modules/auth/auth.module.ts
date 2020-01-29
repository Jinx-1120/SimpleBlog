import config from '@app/app.config'
import * as jwt from 'jsonwebtoken'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthProvider } from './auth.model'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: config.auth.jwtTokenSecret,
      signOptions: {
        expiresIn: config.auth.expiresIn
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthProvider, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
