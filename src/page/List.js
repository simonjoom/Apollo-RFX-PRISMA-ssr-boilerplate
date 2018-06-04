import React from 'react'
import ArticlePromotion from '../components/ArticlePromotion'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import styles from '../css/List'

const List = ({ category, packages, loading }) => (
  loading ? <span>Loading</span> : (<div className={styles.list}>
    <div className={styles.title}>Category: {category}</div>

    <div className={styles.content}>
      <ul>{packages.map(pkg => <li key={pkg}>{pkg}</li>)}</ul>{category === 'redux' ? <ArticlePromotion
        title='Wanna master data-fetching? Read:'
        text='Redux-First Router data-fetching: solving the 80% use case for async Middleware 🚀'
        url='https://medium.com/faceyspacey/redux-first-router-data-fetching-solving-the-80-use-case-for-async-middleware-14529606c262'
      /> : <ArticlePromotion
          title='New to Rudy?? Learn how it started and its motivation:'
          text='Pre Release: Redux-First Router — A Step Beyond Redux-Little-Router 🚀'
          url='https://medium.com/faceyspacey/pre-release-redux-first-router-a-step-beyond-redux-little-router-cd2716576aea'
        />}
    </div>
  </div>)
)

const GET_LIST = gql`
  query getList {
    state {
      category
      packages
    }
  }
`

const WrappedList = graphql(GET_LIST, {
  props: ({ loading, error, data: { state: { category, packages } } }) => {
    if (loading) {
      return { loading }
    }
    if (error) {
      return { error }
    }
    return {
      loading: false,
      category,
      packages
    }
  }
})(List);

export default WrappedList

/*
const mapStateToProps = state => ({
  category: state.category,
  packages: state.packages
})

export default List
 export default connect(mapStateToProps)(List)
*/
