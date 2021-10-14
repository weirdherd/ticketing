import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@whticketsss/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natssWrapper } from '../natss-wrapper';

const router = express.Router();

router.post('/api/payments', 
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    };
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    };
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('已取消的订单不可支付');
    };

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });
    await payment.save();

    new PaymentCreatedPublisher(natssWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
});

export { router as createChargeRouter };
