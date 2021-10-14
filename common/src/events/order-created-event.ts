import { Subjects } from './subjects'
import { OrderStatus } from './types/order-status'

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    version: number   // must have
    status: OrderStatus
    userId: string
    expiresAt: string   // Date in event
    ticket: {
      id: string
      price: number
    }
  }
}
