import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}


export abstract class Listener<T extends Event> {
  abstract subject: T['subject']    // must be actually defined in subclass.
  abstract queueGroupNmae: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected ackWait = 5 * 1000    // could be redefined in subclass.

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupNmae)
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupNmae,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupNmae}`
      )

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })

  }


  parseMessage(msg: Message) {
    const data = msg.getData()

    return typeof data == 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'))
  }
}
