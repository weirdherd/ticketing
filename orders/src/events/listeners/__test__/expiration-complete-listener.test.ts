import { ExpirationCompleteEvent } from "@whticketsss/common"
import mongoose from "mongoose"
import { Order, OrderStatus } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { natssWrapper } from "../../../natss-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listener = new ExpirationCompleteListener(natssWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: '巴赫音乐会',
    price: 20
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdfdf',
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data, msg }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg);

  expect(natssWrapper.client.publish).toHaveBeenCalled()
  
  const eventData =  JSON.parse((natssWrapper.client.publish as jest.Mock).mock.calls[0][1])
  
  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})
