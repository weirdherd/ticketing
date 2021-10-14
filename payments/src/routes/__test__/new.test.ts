import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@whticketsss/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

// jest.mock('../../stripe');



it('返回一个 404 当支付一个不存在的订单', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdfsdfaaa',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('返回一个 401 当支付的订单不属于该用户', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdfsdfaaa',
      orderId: order.id
    })
    .expect(401);
});

it('返回一个 400 当支付一个已被取消的订单', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asdfsdfaaa',
      orderId: order.id
    })
    .expect(400);
});

it('当输入正确时返回一个 204 ', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: price,
    status: OrderStatus.Created
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  });
  
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge?.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();   // .toBeDefined() is good too.

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(order.price * 100);
  // expect(chargeOptions.currency).toEqual('usd');

})