import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const byebyePage = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })

  // 是提交后台执行，类似于 setInterval() 。
  // 不能用异步方式。因为异步方式是中间退出，会造成本页面不能立即返还。
  useEffect(() => {
    doRequest()
  }, [])

  return <div>正在让您退出……</div>
}

export default byebyePage
