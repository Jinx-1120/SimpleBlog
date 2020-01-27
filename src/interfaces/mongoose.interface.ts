/*
 * @Author: jinhaidi
 * @Date: 2019-10-06 17:04:36
 * @Description: Mongoose 和 Paginate 模型的兼容
 * @LastEditTime: 2019-10-06 17:04:57
 */

import { ModelType } from 'typegoose'
import { PaginateModel, Document } from 'mongoose'

export type TMongooseModel<T> = ModelType<T> & PaginateModel<T & Document>
