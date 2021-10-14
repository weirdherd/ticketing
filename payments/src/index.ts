// This is only a comment line...

import mongoose from 'mongoose'
import { app } from './app'
import { natssWrapper } from './natss-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

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

    new OrderCreatedListener(natssWrapper.client).listen()
    new OrderCancelledListener(natssWrapper.client).listen()

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
    console.log('payments: listening on port 3000 ...')

  })
}

start()
