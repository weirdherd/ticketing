import request from 'supertest'
import { app } from '../../app'


const createTicket = async () => {
  await request(app)    // await or return, one of them must be used.
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'askflasdf',
      price: 20
    })
}


it('can fetch a list of tickets', async () => {
  await createTicket()    // await could be omited.
  await createTicket()
  await createTicket()

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  // console.log(response.body)    // for seeing the actual result.
  expect(response.body.length).toEqual(3)
})

