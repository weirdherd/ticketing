import Link from 'next/link'

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: '注册', href: '/auth/signup' },
    !currentUser && { label: '签到', href: '/auth/signin' },
    currentUser && { label: '售票', href: '/tickets/new' },
    currentUser && { label: '我下的单', href: '/orders' },
    currentUser && { label: '退出', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      )
    })

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix票仓</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  )
}

export default Header
