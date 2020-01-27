/*
 * @Author: jinhaidi
 * @Date: 2019-10-04 21:57:22
 * @Description: 邮箱设置
 * @LastEditTime: 2019-10-06 14:05:23
 */
import * as nodemailer from 'nodemailer'
import config from '@app/app.config'
import { Injectable } from '@nestjs/common'
// import { getMessageFromNormalError } from '@app/transforms/error.transform'

// 邮件格式
export interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {

  private transporter: nodemailer;
  private clientIsValid: boolean;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      secure: true,
      port: 465,
      auth: {
        user: config.emial.account,
        pass: config.emial.pwd,
      },
    });
    this.verifyClient();
  }

  // 验证有效性
  private verifyClient(): void {
    return this.transporter.verify((error, success) => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30)
        console.warn('邮件客户端初始化连接失败！将在半小时后重试：')
      } else {
        this.clientIsValid = true
        console.info('邮件客户端初始化连接成功！随时可发送邮件')
      }
    });
  }

  // 发邮件
  public sendMail(mailOptions: IEmailOptions) {
    if (!this.clientIsValid) {
      console.warn('由于未初始化成功，邮件客户端发送被拒绝！');
      return false;
    }
    const options = Object.assign(mailOptions, { from: config.emial.from });
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        console.warn('邮件发送失败！');
      } else {
        console.info('邮件发送成功', info.messageId, info.response);
      }
    });
  }
}
