// This is only a comment line...

import mongoose from 'mongoose'
import { app } from './app'

import { natssWrapper } from './natss-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined.')
  }
  if (!process.env.NATSS_URL) {
    throw new Error('NATSS_URL must be defined.')
  }
  if (!process.env.NATSS_CLUSTER_ID) {
    throw new Error('NATSS_CLUSTER_ID must be defined.')
  }
  if (!process.env.NATSS_CLIENT_ID) {
    throw new Error('NATSS_CLIENT_ID must be defined.')
  }

  try {
    await natssWrapper.connect(
      process.env.NATSS_CLUSTER_ID,
      process.env.NATSS_CLIENT_ID,
      process.env.NATSS_URL
    )
    natssWrapper.client.on('close', () => {
      console.log('NATS connection closed.')
      process.exit()
    })
    process.on('SIGINT', () => natssWrapper.client.close())
    process.on('SIGTERM', () => natssWrapper.client.close())

    new TicketCreatedListener(natssWrapper.client).listen()
    new TicketUpdatedListener(natssWrapper.client).listen()
    new ExpirationCompleteListener(natssWrapper.client).listen()
    new PaymentCreatedListener(natssWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    console.log('Connected to MongoDb')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('auth: listening on port 3000 ...')

  })
}

start()
