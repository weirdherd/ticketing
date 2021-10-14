// import css here for global usage.
import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

// A component is a function, which builds up and returns an HTML element.
// A Next application has an outmost wrapper component, refered as 'app'.
// The app component(function) receives merely an object as argument.
// In component definition, we use destruct syntax to get specific attributes.
// By convention, parameter named Component receives a React component.
// Each time the browser access a URL, 
// the corresponding route handler must export a React component.

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent
