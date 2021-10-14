import { Subjects, Publisher, OrderCreatedEvent } from "@whticketsss/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}

// Usage:
// new OrderCreatedPublisher(natssClient).publish({...})
