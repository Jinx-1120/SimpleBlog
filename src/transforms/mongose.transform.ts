/*
 * @Author: jinhaidi
 * @Date: 2019-10-04 22:09:42
 * @Description: mongose 转换器
 * @LastEditTime: 2020-01-27 18:34:46
 */
import * as _mongoose from 'mongoose'
import * as _mongoosePaginate from 'mongoose-paginate'
import * as _mongooseAutoIncrement from 'mongoose-auto-increment'
import config from '@app/app.config'

// 各种 Hack
_mongoose.set('useFindAndModify', false);
(_mongoose as any).Promise = global.Promise;

// 初始化翻页插件
_mongooseAutoIncrement.initialize(_mongoose.connection);

// 插件配置初始化
(_mongoosePaginate as any).paginate.options = {
  limit: config.app.limit
}

export const mongoose = _mongoose
export const mongoosePaginate = _mongoosePaginate
export const mongooseAutoIncrement = _mongooseAutoIncrement
export default mongoose
