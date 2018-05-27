import React from 'react'
import { connect } from 'react-redux'
import Player from '../components/Player'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styles from '../css/Video'

const Video = ({feedQuery, slug, title, youtubeId, category, by, color, tip}) => {
 /* if (feedQuery && feedQuery.loading) {
    return <div>Loading</div>
  }
  if (feedQuery && feedQuery.error) {
    return <div>Error</div>
  }*/
  console.log(feedQuery)
  return (
    <div className={styles.video}>
      <Player slug={slug} youtubeId={youtubeId} color={color}/>
      
      <div className={styles.infoContainer}>
        <span className={styles.title}>{title}</span>
        
        <div className={styles.infoRow}>
          <div className={styles.category} style={{backgroundColor: color}}>
            <span>{category}</span>
          </div>
          
          <span className={styles.byText}>by: {by}</span>
        </div>
        
        <div className={styles.separator}/>
        
        <span className={styles.tipTitle}>Tip</span>
        <div className={styles.tip}>
          {slug
            ? tip
            : <span style={{color: 'orange'}}>
              YOU FOUND A MISSING FEATURE!
              There is no data because you Refreshed the video page,
              whose data is fetched on the previous page. Try adding a thunk
              to this route in
              <span style={{color: 'white'}}> configureStore.js </span>
              to insure when
              visited directly this page has its data as well. Use the
              <span style={{color: 'white'}}> findVideo(slug) </span>
              method in
              <span style={{color: 'white'}}>../api/index.js:</span>
          </span>}
        </div>
      </div>
    </div>)
}

const mapState = state => state.videosHash[state.slug] || {}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }`;


export default connect(mapState)(graphql(FEED_QUERY, {
  name: 'feedQuery'
})(Video))

