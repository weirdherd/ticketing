import { natssWrapper } from './natss-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
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
  } catch (err) {
    console.error(err)
  }
}

start()
