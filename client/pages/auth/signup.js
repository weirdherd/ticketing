// this module export a React Coponent,
// which means a function to run in the clent-side.

import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const signupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push('/')
    },
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>注册</h1>
      <div className="form-group">
        <label>邮箱地址：</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
        <label>密码：</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">注册</button>
    </form>
  )
}

export default signupPage
