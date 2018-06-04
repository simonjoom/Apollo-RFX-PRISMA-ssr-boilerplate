import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from '../Link'
import styles from '../css/Sidebar.css'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Sidebar = ({ path }, { client: { reduxdispatch: dispatch } }) => (
  <div className={styles.sidebar}>
    <h2>SEO-FRIENDLY LINKS</h2>

    <NavLink to='/' activeClassName={styles.active}>
      Home
    </NavLink>
    <NavLink
      to='/list/db-graphql'
      activeClassName={styles.active}>
      DB & GRAPHQL
    </NavLink>

    <NavLink
      activeClassName={styles.active}
      to={{ type: 'VIDEOLIST', params: { category: 'fp' } }}
    >
      FP
    </NavLink>

    <NavLink
      activeClassName={styles.active}
      to={{ type: 'VIDEO', params: { slug: 'transducers' } }}
    >
      transducers
      </NavLink>
    <NavLink
      to='/list/redux'
      className={isActive(path, '/list/redux')}
      tabIndex='0'
      onClick={() =>
        dispatch({ type: 'LIST', params: { category: 'redux' } })}
    >
      Redux
    </NavLink>
    <span
      role='link'
      className={isActive(path, '/list/react')}
      tabIndex='0'
      onClick={() =>
        dispatch({ type: 'LIST', params: { category: 'react' } })}
    >
      React
    </span>
    <span
      role='link'
      tabIndex='0'
      onClick={() => dispatch({ type: 'NOT_FOUND' })}
    >
      NOT_FOUND
    </span>

    <div style={{ height: 20 }} />

    <h2>EVENT HANDLERS</h2>

    <span role='link' tabIndex='0' onClick={() => dispatch({ type: 'HOME' })}>
      Home
    </span>
  </div>
)
Sidebar.contextTypes = {
  client: PropTypes.any
}

const isActive = (actualPath, expectedPath) =>
  actualPath === expectedPath ? styles.active : ''
/*
const mapStateToProps = state => ({
  path: state.location.pathname
})*/
const GET_PATH = gql`
  query getPath {
    state @client {
      location @client {
        pathname
      }
    }
  }
`

const WrappedSidebar = graphql(GET_PATH, {
  props: ({ loading, error, data: { state: { location: { pathname } } } }) => {
    if (loading) {
      return { loading }
    }
    if (error) {
      return { error }
    }
    return {
      loading: false,
      path: pathname
    }
  }
})(Sidebar)
export default WrappedSidebar
//export default connect(mapStateToProps)(Sidebar)
