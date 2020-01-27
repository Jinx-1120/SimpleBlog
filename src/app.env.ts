/*
 * @Author: jinhaidi
 * @Date: 2019-09-15 13:59:26
 * @Description: 环境变量
 * @LastEditTime: 2019-09-15 14:03:44
 */

export const environment = process.env.NODE_ENV;
export const isDev = Object.is(environment, 'development');
export const isPro = Object.is(environment, 'production');
export const isTest = Object.is(environment, 'test');
