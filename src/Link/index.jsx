import * as React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import type { Connector } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { matchUrl, urlToLocation } from 'rfx/utils'

import { toUrlAndAction, handlePress, preventDefault } from 'rfx-link/utils'
/*
type OwnProps = {
  to: To,
  redirect?: boolean,
  children?: any,
  onPress?: OnClick,
  onClick?: OnClick,
  down?: boolean,
  shouldDispatch?: boolean,
  target?: string,
  style?: Object,
  className?: string,
  activeStyle?: Object,
  activeClassName?: string,
  ariaCurrent?: string,
  partial?: boolean,
  strict?: boolean,
  query?: boolean,
  hash?: boolean,
  isActive?: (?Object, Object) => boolean,
  component?: string | React.ComponentType<any>,
  rudy: Object
}

type Props = {
  dispatch: Function,
  basename: string,
  routesAdded?: number,
  url?: string,
  currentPathname?: string
} & OwnProps

type Context = {
  store: Store<*, *>
}*/
const LinkInner = (props, context) => {
  const {
    to,
    redirect,
    component: Component = 'a',
    children,
    onPress,
    onClick,
    down = false,
    shouldDispatch = true,
    target,
    dispatch = context.client.dispatch,
    basename: bn,
    currentPathname: cp, // used only for relative URLs
    rudy,
    routesAdded,

    url: u,
    isActive,
    partial,
    strict,
    query,
    hash,
    activeStyle,
    activeClassName,
    ariaCurrent,

    ...p
  } = props

  const {
    routes, getLocation, options, history
  } = rudy

  const curr = cp || getLocation().pathname // for relative paths and incorrect actions (incorrect actions don't waste re-renderings and just get current pathname from context)
  const { fullUrl, action } = toUrlAndAction(to, routes, bn, curr, options)
  const hasHref = Component === 'a' || typeof Component !== 'string'


  return (
    <Component
      onClick={e => {
        //e && e.preventDefault && e.preventDefault()
        if (!down) {
          return handlePress(
            action,
            routes,
            shouldDispatch,
            dispatch,
            onPress || onClick,
            target,
            redirect,
            fullUrl,
            history,
            e
)
        }
      }}
      href={hasHref ? fullUrl : undefined}
      onMouseDown={down ? handler : undefined}
      onTouchStart={down ? handler : undefined}
      target={target}
      {...p}
      {...navLinkProps(props, fullUrl, action)}
    >
      {children}
    </Component>
  )
}

LinkInner.contextTypes = {
  client: PropTypes.any
}

const navLinkProps = (props, toFullUrl, action) => {
  if (!props.url) return

  const {
    basename,
    url,
    isActive,
    partial,
    strict,
    query: q,
    hash: h,

    style,
    className,
    activeStyle,
    activeClassName = '',
    ariaCurrent = 'true',

    rudy
  } = props

  const { getLocation, options, routes } = rudy
  const { pathname, query, hash } = urlToLocation(toFullUrl)
  const matchers = { path: pathname, query: q && query, hash: h && hash }
  const opts = { partial, strict }
  const route = routes[action.type] || {}
  const match = matchUrl(url, matchers, opts, route, options)

  if (match) {
    Object.assign(match, action)
  }

  const active = !!(isActive ? isActive(match, getLocation()) : match)

  return {
    style: active ? { ...style, ...activeStyle } : style,
    className: `${className || ''} ${active ? activeClassName : ''}`.trim(),
    'aria-current': active && ariaCurrent
  }
}
/*
const mapState = (state, { ...props }) => {
  const { url, pathname, basename: bn, routesAdded } = global.rudy.getLocation()
  const isNav = props.activeClassName || props.activeStyle // only NavLinks re-render when the URL changes

  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.
  let currentPathname

  if (typeof props.to === 'string' && props.to.charAt(0) !== '/') {
    currentPathname = pathname
  }

  const basename = bn ? `/${bn}` : ''

  return { rudy, basename, routesAdded, url: isNav && url, currentPathname: pathname }
}
*/
// const connector: Connector<OwnProps, Props> = connect(mapState)
/* const mapQueryToProps = ({
  loading, error, data, ownProps
}) => {
  console.log('ownProps', ownProps, data)
  const {
    url, pathname, basename: bn, routesAdded
  } = global.rudy.getLocation()
  const isNav = ownProps.activeClassName || ownProps.activeStyle // only NavLinks re-render when the URL changes

  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.
  let currentPathname

  if (typeof ownProps.to === 'string' && ownProps.to.charAt(0) !== '/') {
    currentPathname = pathname
  }

  const basename = bn ? `/${bn}` : ''

  return {
    rudy: global.rudy, dispatch: client.dispatch, basename, routesAdded, url: isNav && url, currentPathname: pathname
  }
}*/

const GET_STATE = gql`
  query getState{
    state @client{
     title
    } 
}
`
/*
      location {
          pathname
          type
          payload
          query
          search
          prev
          kind
          universal
      } */
const Link = ownProps => {
  const {
    url, pathname, basename: bn, routesAdded
  } = global.rudy.getLocation()
  const isNav = ownProps.activeClassName || ownProps.activeStyle // only NavLinks re-render when the URL changes

  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.
  let currentPathname

  if (typeof ownProps.to === 'string' && ownProps.to.charAt(0) !== '/') {
    currentPathname = pathname
  }

  const basename = bn ? `/${bn}` : ''

  const passprops = {
 ...ownProps, rudy: global.rudy, basename, routesAdded, url: isNav && url, currentPathname: pathname 
}
  return <LinkInner {...passprops} />
}

// const LinkConnected = graphql(GET_STATE, { props: mapQueryToProps })(LinkInner)

// const LinkConnected = connector(LinkInner)

// const Link = props => <LinkConnected {...props} />

// Link.contextTypes = { store: PropTypes.object.isRequired }

export default Link

export { Link }

export const NavLink = ({ activeClassName = 'active', ...props }) =>
  <Link activeClassName={activeClassName} {...props} />
