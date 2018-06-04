import React from 'react'
//import { connect } from 'react-redux'
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
  return (
    <div className={styles.switcher}>
      <UniversalComponent page={page} isLoading={isLoading}/>
    </div>
  )
}
/*
const mapStateToProps = state => ({
  page: state.page,
  direction: state.direction,
  isLoading: isLoading(state)
})*/

const GET_PAGE = gql`
  query getPage {
    state {
    page @client
    }
  }
`;

const WrappedComponent = graphql(GET_PAGE, {
  props: ({data: {loading, error, state}}) => {
    if (loading) {
      return {loading};
    }
    console.log(loading)
    console.log(state);
    console.log(state.page);
    if (error) {
      return {error};
    }
    
    return {
      loading: false,
      direction: state.direction,
      page:state.page
    };
  }
})(Switcher);

export default WrappedComponent;

//export default connect(mapStateToProps)(Switcher)
