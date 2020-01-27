/*
 * @Author: jinhaidi
 * @Date: 2019-10-04 20:54:18
 * @Description: 数据库构造器
 * @LastEditTime: 2020-01-25 19:50:02
 */

import * as lodash from 'lodash'
import config from '@app/app.config'

import mongoose from '@app/transforms/mongose.transform'
import { EmailService } from '@app/assite/email.service'
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant'

export const databaseProvider = {
  inject: [EmailService],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {

    const RECONNET_INTERVAL = 6000

    // 发送告警邮件（18 秒节流）
    const sendAlarmMail = lodash.throttle((error: string) => {
      emailService.sendMail({
        to: config.emial.from,
        subject: `${config.app.name} 数据库发生异常！`,
        text: error,
        html: `<pre><code>${error}</code></pre>`
      })
    }, RECONNET_INTERVAL * 3)

    // 连接数据库
    function connection() {
      return mongoose.connect(config.dburi, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        autoReconnect: true,
        reconnectInterval: RECONNET_INTERVAL
      }, error => {
        console.log(error)
      })
    }

    mongoose.connection.on('connecting', () => {
      console.log('数据库连接中...')
    })

    mongoose.connection.on('open', () => {
      console.info('数据库连接成功！')
    })

    mongoose.connection.on('disconnected', () => {
      console.error(`数据库失去连接！尝试 ${RECONNET_INTERVAL / 1000}s 后重连`)
      setTimeout(connection, RECONNET_INTERVAL)
    })

    mongoose.connection.on('error', error => {
      console.error('数据库发生异常！', error)
      mongoose.disconnect()
      sendAlarmMail(String(error))
    })

    return await connection()
  }
}
