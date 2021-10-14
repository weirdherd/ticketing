import { Subjects, Publisher, OrderCancelledEvent } from "@whticketsss/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}

// Usage:
// new OrderCancelledPublisher(natssClient).publish({...})
