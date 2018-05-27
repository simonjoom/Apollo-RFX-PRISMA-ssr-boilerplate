import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'rfx-link'
import styles from '../css/Sidebar.css'

const Sidebar = ({path, dispatch}) => (
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
      to={{type: 'VIDEOLIST', params: {category: 'fp'}}}
    >
      FP
    </NavLink>
      
      <NavLink
        activeClassName={styles.active}
        to={{ type: 'VIDEO', params: { slug: 'transducers' } }}
      >
          transducers
      </NavLink>
      
    
    <span
      role='link'
      className={isActive(path, '/list/redux')}
      tabIndex='0'
      onClick={() =>
        dispatch({type: 'LIST', params: {category: 'redux'}})}
    >
        Redux
    </span>
    <span
      role='link'
      className={isActive(path, '/list/react')}
      tabIndex='0'
      onClick={() =>
        dispatch({type: 'LIST', params: {category: 'react'}})}
    >
        React
    </span>
    
    <span
      role='link'
      tabIndex='0'
      onClick={() => dispatch({type: 'NOT_FOUND'})}
    >
        NOT_FOUND
    </span>
    
    <div style={{height: 20}}/>
    
    <h2>EVENT HANDLERS</h2>
    
    <span role='link' tabIndex='0' onClick={() => dispatch({type: 'HOME'})}>
        Home
    </span>
  </div>
)

const isActive = (actualPath, expectedPath) =>
  actualPath === expectedPath ? styles.active : ''

const mapStateToProps = state => ({
  path: state.location.pathname
})

export default connect(mapStateToProps)(Sidebar)
