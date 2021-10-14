import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@whticketsss/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('订单找不到');
    };

    order.set({
      status: OrderStatus.Complete
    });
    await order.save();
    // Coz the order is completed, no further change is permitted.
    // So, here is not any more message publishing.

    msg.ack();
  }
}