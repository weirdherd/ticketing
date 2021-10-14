import { Subjects, Publisher, ExpirationCompleteEvent } from "@whticketsss/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
