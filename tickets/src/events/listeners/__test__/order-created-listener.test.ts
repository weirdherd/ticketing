import { OrderCreatedListener } from "../order-created-listener"
import { natssWrapper } from "../../../natss-wrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCreatedEvent, OrderStatus } from "@whticketsss/common"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natssWrapper.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asddfasdf'
  })
  await ticket.save()

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfdf',
    expiresAt: 'asfdsfaf',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTciket = await Ticket.findById(ticket.id)

  expect(updatedTciket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natssWrapper.client.publish).toHaveBeenCalled()

  // @ts-ignore
  const ticketUpdatedData = JSON.parse(natssWrapper.client.publish.mock.calls[0][1])
  console.log(ticketUpdatedData)
  expect(data.id).toEqual(ticketUpdatedData.orderId)

})