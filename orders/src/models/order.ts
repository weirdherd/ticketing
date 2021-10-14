
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import mongoose from 'mongoose'
import { OrderStatus } from '@whticketsss/common'
import { TicketDoc } from './ticket'

export { OrderStatus }

interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}


const orderSchema = new mongoose.Schema<OrderDoc>({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    require: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
// Note, 
// we use argument of OrderDoc to construct instance of orderSchema.
// An OrderDoc contains a whole ticket instance,
// but an orderSchema contains only the id of the ticket instance.
// So, while constructing, for ticket, a key of ref, 
// its value is fetched from the id of OrderDoc instance automaically.


export { Order }
