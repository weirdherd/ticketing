import natss from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener'

console.clear()

const stan = natss.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATSS')

  stan.on('close', () => {
    console.log('NATSS connection closed!')
    process.exit()

  })

  new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
process.on('SIGQUIT', () => stan.close())
process.on('SIGKILL', () => stan.close())


