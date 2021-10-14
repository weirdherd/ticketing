import { Message } from 'node-nats-streaming'
import { Listener } from './basic-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subjects'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupNmae = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data)

    console.log(data.id)
    console.log(data.title)
    console.log(data.price)

    msg.ack()
  }
}
