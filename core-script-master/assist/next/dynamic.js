// 动态组件的示例

import React from 'react'
import Router from 'next/router'
import Header from '../components/Header'
import Counter from '../components/Counter'
import dynamic from 'next/dynamic'
import { asyncReactor } from 'async-reactor'

const DynamicComponent = dynamic(import('../components/hello1'))

// 常用
const DynamicBundle = dynamic({
  ssr: false,
  modules: (props) => {
    const components = {
      Hello6: import('../components/hello6')
    }

    if (props.showMore) {
      components.Hello7 = import('../components/hello7')
    }

    return components
  },
  render: (props, { Hello6, Hello7 }) => (
    <div style={{padding: 10, border: '1px solid #888'}}>
      <Hello6 />
      {Hello7 ? <Hello7 /> : null}
    </div>
  )
})


const DynamicComponentWithCustomLoading = dynamic(
  import('../components/hello2'),
  {
    loading: () => (<p>...</p>)
  }
)

const DynamicComponentWithNoSSR = dynamic(
  import('../components/hello3'),
  { ssr: false }
)
const DynamicComponentWithAsyncReactor = asyncReactor(async () => {
  const Hello4 = await import('../components/hello4')
  return (<Hello4 />)
})

const DynamicComponent5 = dynamic(import('../components/hello5'))


export default class Index extends React.Component {
  static getInitialProps ({ query }) {
    return { showMore: Boolean(query.showMore) }
  }

  toggleShowMore () {
    const { showMore } = this.props
    if (showMore) {
      Router.push('/')
      return
    }

    Router.push('/?showMore=1')
  }

  render () {
    const { showMore } = this.props

    return (
      <div>
        <Header />
        <DynamicComponent />
        <DynamicComponentWithCustomLoading />
        <DynamicComponentWithNoSSR />
        <DynamicComponentWithAsyncReactor />
        <DynamicBundle showMore={showMore} />
        <button onClick={() => this.toggleShowMore()}>Toggle Show More</button>
        {
          /*
            Since DynamicComponent5 does not render in the client,
            it won't get downloaded.
          */
        }
        { React.noSuchField === true ? <DynamicComponent5 /> : null }

        <p>HOME PAGE is here!</p>
        <Counter />
      </div>
    )
  }
}