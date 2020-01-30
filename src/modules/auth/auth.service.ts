import config from '@app/app.config'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@app/util/model.transform'
import { decodeBase64, decodeMd5 } from '@app/util/code.transform'
import { TMongooseModel } from '@app/interfaces/mongoose.interface'
import { Auth, AuthLogin } from '@app/modules/auth/auth.model'
import { CustomError } from '@app/errors';

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

  private user: AuthLogin
  // 签发 Token
  private createToken(data: any): ITokenResult {
    return {
      access_token: this.jwtService.sign({ data }),
      expires_in: config.auth.expiresIn as unknown as number
    }
  }

  // 验证 Auth 数据
  public async validateAuthData(payload: any): Promise<any> {
    const findUser = await this.authModel.findById(payload.data._id).exec()
    if (findUser) {
      this.user = findUser
      return payload.data
    } else return false
  }

  // 获取管理员信息
  public getAdminInfo(): Promise<Auth> {
    return this.authModel.findOne(null, '_id name description friends link gravatar').exec()
  }

  // 修改管理员信息
  public async putAdminInfo(auth: Auth): Promise<Auth> {
    // 可通过this.user 判断当前用户
    // console.log(this.user)
    const findUser = await this.authModel.findOne({ name: auth.name }).exec()
    const loginPassword = decodeMd5(decodeBase64(auth.password))
    if (loginPassword === findUser.password) {
      Reflect.deleteProperty(auth, 'password')
      auth.password = decodeMd5(decodeBase64(auth.newPassword))
      Reflect.deleteProperty(auth, 'newPassword')
      return this.authModel.findByIdAndUpdate(findUser._id, auth).findOne(null, '_id name gravatar description')
    } else {
      return Promise.reject('旧密码错误')
    }
  }

  // 登陆
  public async adminLogin(user: AuthLogin): Promise<ITokenResult> {
    const findUser = await this.authModel.findOne({ name: user.name }).exec()
    const loginPassword = decodeMd5(decodeBase64(user.password))
    if (loginPassword === findUser.password) {
      return Promise.resolve(this.createToken({
        name: findUser.name,
        _id: findUser._id
      }))
    } else {
      return Promise.reject('密码不匹配')
    }
  }

  public async addAdmin(auth: Auth): Promise<any> {
    try {
      const users = await this.authModel.find({ name: auth.name }).exec()
      if (users.length) return Promise.reject('账户已被占用')
      const Md5Pwd = decodeMd5(decodeBase64(auth.password))
      Reflect.deleteProperty(auth, 'password')
      auth.password = Md5Pwd
      const createAuth = new this.authModel(auth)
      return createAuth.save().findOne(null, '_id name gravatar description')
    } catch (error) {
      const message = '账户创建失败'
      throw new CustomError({ message, error })
    }
  }
}
