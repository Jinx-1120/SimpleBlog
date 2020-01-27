import * as lodash from 'lodash'
import config from '@app/app.config'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@app/util/model.transform'
import { decodeBase64, decodeMd5 } from '@app/util/code.transform'
import { TMongooseModel } from '@app/interfaces/mongoose.interface'
import { Auth } from './auth.model'

export interface ITokenResult {
  access_token: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Auth) private readonly authModel: TMongooseModel<Auth>
  ) {}

  // 签发 Token
  private createToken(): ITokenResult {
    return {
      access_token: this.jwtService.sign({ data: config.auth.data }),
      expires_in: config.auth.expiresIn as unknown as number
    }
  }

  // 获取已有密码
  private getExtantPassword(auth: Auth): string {
    return auth && auth.password || decodeMd5(config.auth.defaultPassword as string)
  }

  // 验证 Auth 数据
  public validateAuthData(payload: any): Promise<any> {
    console.log(payload)
    const isVerified = lodash.isEqual(payload.data, config.auth.data)
    return isVerified ? payload.data : null
  }

  // 获取管理员信息
  public getAdminInfo(): Promise<Auth> {
    return this.authModel.findOne(null, '-_id name slogan gravatar').exec()
  }

  // 修改管理员信息
  public putAdminInfo(auth: Auth): Promise<Auth> {
    // 密码解码
    const password = decodeBase64(auth.password)
    const newPassword = decodeBase64(auth.newPassword)

    Reflect.deleteProperty(auth, 'password')
    Reflect.deleteProperty(auth, 'new_password')

    // 验证密码
    if (password || newPassword) {
      if (!password || !newPassword) {
        return Promise.reject('密码不完整或无效')
      }
      if (password === newPassword) {
        return Promise.reject('新旧密码不可一致')
      }
    }

    return this.authModel
      .findOne()
      .exec()
      .then(extantAuth => {

        // 修改密码 -> 核对已存在密码
        if (password) {
          const oldPassword = decodeMd5(password)
          const extantPassword = this.getExtantPassword(extantAuth)
          if (oldPassword !== extantPassword) {
            return Promise.reject('原密码不正确')
          } else {
            auth.password = decodeMd5(newPassword)
          }
        }

        // 更新数据
        const action = extantAuth && !!extantAuth._id
          ? Object.assign(extantAuth, auth).save()
          : new this.authModel(auth).save()

        return action.then(data => {
          const res = data.toObject()
          Reflect.deleteProperty(res, 'password')
          return res
        })
      })
  }

  // 登陆
  public adminLogin(password: string): Promise<ITokenResult> {
    return this.authModel
      .findOne(null, 'password')
      .exec()
      .then(auth => {
        const extantPassword = this.getExtantPassword(auth)
        const loginPassword = decodeMd5(decodeBase64(password))
        if (loginPassword === extantPassword) {
          return Promise.resolve(this.createToken())
        } else {
          return Promise.reject('密码不匹配')
        }
      })
  }

  public addAdmin(auth: Auth): Promise<any> {
    const Md5Pwd = decodeMd5(decodeBase64(auth.password))
    Reflect.deleteProperty(auth, 'password')
    auth.password = Md5Pwd
    this.authModel(auth).save()
    return this.authModel.find().exec()
  }
}
