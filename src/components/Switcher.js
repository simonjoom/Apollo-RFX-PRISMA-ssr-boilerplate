import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import isLoading from '../selectors/isLoading'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import styles from '../css/Switcher'

const UniversalComponent = universal(({page}) => import(`../page/${page}`), {
  minDelay: 500,
  
  loading: () => (
    <div className={styles.spinner}>
      <div/>
    </div>
  ),
  
  error: () => <div className={styles.notFound}>PAGE NOT FOUND - 404</div>
})

const Switcher = ({page, direction, isLoading, feedQuery}) => {
  console.log(feedQuery);
  return (
    <div className={styles.switcher}>
      <UniversalComponent page={page} isLoading={isLoading}/>
    </div>
  )
}

const mapStateToProps = state => ({
  page: state.page,
  direction: state.direction,
  isLoading: isLoading(state)
})
export default connect(mapStateToProps)(Switcher)
