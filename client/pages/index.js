import Link from 'next/link';

const landingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          {/* 为了在 query 中创建 ticketId 属性，不使用 href={`/tickets/${ticket.id}`} */}
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>打开</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h2>现有的票</h2>
      <table className="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>价格</th>
            <th>信息</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

// 返回值将被送往 landingPage() 用作实参。
landingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  
  return { tickets: data }
}

export default landingPage
