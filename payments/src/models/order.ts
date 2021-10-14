import { OrderStatus } from '@whticketsss/common';
import mongoose, { version } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// 规定自定义的 OrderModel.build() 方法的调用参数
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// 规定 mongoose.Model 内部类型检查（泛配类型的落实）。
interface OrderDoc extends mongoose.Document {
  // id 是 Document 已自含的，扩展时不必给出。
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// 规定 new OrderModel() 的调用参数（需给出的属性或方法）
// 泛配类型 落实为 OrderDoc , 从 Model代码 可知是施加于返回值类型。
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// 所有 interface 都是给 TS 用的，主要用于 类型检查，或用作类模块。
// 真正的 JS 代码是下面这些。


// 面向应用概念的记录型，可称之为 缉要 或 要缉 。
// 不得漏掉 <OrderDoc> ，否则在用作 mongoose.model() 参数时，TS 会提示类型错误。
// 原因在于 TS 会默认与 orderScheam 配套的是 any, 而不是 OrderDoc 
const orderSchema = new mongoose.Schema<OrderDoc>({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    require: true
  },
  status: {
    type: String,
    require: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});
// 把 mongoose 的 _v 更名为 updateIfCurrent 的 version ，并管起来。
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
