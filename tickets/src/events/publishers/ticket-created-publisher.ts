import { Publisher, Subjects, TicketCreatedEvent } from '@whticketsss/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated

}