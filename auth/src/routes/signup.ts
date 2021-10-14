import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'

import { validateRequest, BadRequestError } from '@whticketsss/common'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email 格式不对。'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password 长度要求为 4 到 20 字符。')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      // console.log('Email in use.')
      throw new BadRequestError('Email in use.')
    }

    const user = User.build({ email, password })
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    },
      process.env.JWT_KEY!  // the ! at the end is just for bypassing JS check 
    )

    // Store it on session object
    req.session = {
      jwt: userJwt
    }


    res.status(201).send(user)

  })

export { router as signupRouter }