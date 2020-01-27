/*
 * @Author: jinhaidi
 * @Date: 2019-10-04 21:22:26
 * @Description: 配置中心
 * @LastEditTime: 2020-01-25 19:50:14
 */
import * as path from 'path'
import * as dotenvSafe from 'dotenv-safe'
import { isPro } from './app.env'

dotenvSafe.config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
})
const config = {
  app: {
    name: '靳海迪的个人日志',
    limit: 10
  },
  dburi: isPro ? process.env.MONGO_URI1 : process.env.MONGO_URI2,
  port: process.env.PORT,
  logs: isPro ? process.env.MORGAN_LOG1 : process.env.MORGAN_LOG2,
  qiniuConfig: {
    accessKey: process.env.QINIUACCESSKEY,
    secretKey: process.env.QINIUSECRETKEY,
    bucket: process.env.QINIUBUCKET,
    origin: process.env.QINIUORIGIN
  },
  MD5_SUFFIXSTR: process.env.MD5_SUFFIXSTR,
  baidu: {
    site: process.env.SITE,
    token: process.env.BAIDUTOKEN
  },
  emial: {
    account: process.env.EMAIL_ACCOUNT,
    pwd: process.env.EMAIL_PWD,
    from: process.env.EMAIL_FROM
  },
  auth: {
    data: { name: 'blog_root'},
    defaultPassword: '111111',
    expiresIn: process.env.EXPIRESIN,
    jwtTokenSecret: process.env.JWTTOKENSECRET
  }
}
export default config
