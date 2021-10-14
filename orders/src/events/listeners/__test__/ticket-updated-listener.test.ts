import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { TicketUpdatedEvent } from "@whticketsss/common"

import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natssWrapper } from "../../../natss-wrapper"
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natssWrapper.client)

    // Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert音乐会',
        price: 999,
        userId: 'adsadfads'
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()      // just to know the times and params while called.
    }

    return { msg, data, ticket, listener }
}


it('finds, updates, and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    // write assertion to make sure a ticket was create
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
    const { msg, data, listener } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version', async () => {
  const { msg, data, listener, ticket }  = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (err) {

  }

  expect (msg.ack).not.toHaveBeenCalled()
})