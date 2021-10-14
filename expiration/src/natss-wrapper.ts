import natss, { Stan } from 'node-nats-streaming'

class NatssWrapper {
  private _client?: Stan

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATSS client before connected.')
    }

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = natss.connect(clusterId, clientId, { url })

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATSS')
        resolve('')
      })
      this.client.on('error', (err) => {
        reject(err)
      })

    })

  }
}

export const natssWrapper = new NatssWrapper()
// While imported, NO new NatssWrapper() will be executed again.
// This new NatssWrapper() would be executed one time, yields out ONE instance,
// and this export just makes this instance visible to all the importing code-ranges.
