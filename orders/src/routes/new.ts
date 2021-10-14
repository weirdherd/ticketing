import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@whticketsss/common'
import { body } from 'express-validator'

import mongoose from 'mongoose'

import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natssWrapper } from '../natss-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60    // short for test, long in real use.

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()

      // 这一句可不要，以减少对 mongoDB 代码内部零散绑定。
      .custom((input: string) => { return mongoose.Types.ObjectId.isValid(input) })

      .withMessage('TicketId must be provided.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order in the database.
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // Make sure that this ticket is not alreddy reserved.
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved.')
    }

    // Calculate an expiration date for this order.
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database.
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save()
    
    // Publish an event saying that an order was created.
    new OrderCreatedPublisher(natssWrapper.client).publish({
      id: order.id,
      version: order.ticket.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })


    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
