import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// import { connect } from 'react-redux'
import { Link } from '../Link'

import styles from '../css/List'

const ListVideo = ({ videos }) =>
  (<div className={styles.list}>
    {videos.map(video => <Row {...video} key={video.youtubeId} />)}
   </div>)


const Row = ({
  slug, title, youtubeId, by, color
}) =>
  (<Link
    className={styles.row}
    to={`/video/${slug}`}
    style={{ backgroundImage: youtubeBackground(youtubeId) }}
  >
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      {initials(by)}
    </div>
    <span className={styles.title}>{title}</span>

    <div className={styles.gradient} />
    <span className={styles.by}>by: {by}</span>
   </Link>)

const youtubeBackground = youtubeId =>
  `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg)`

const initials = by => by.split(' ').map(name => name[0]).join('')
/*
const mapState = ({ category, videosByCategory, videosHash }) => {
  const slugs = videosByCategory[category] || []
  const videos = slugs.map(slug => videosHash[slug])
  return { videos }
}
*/
const GET_LISTVIDEO = gql`
  query GET_LISTVIDEO {
    state {
      category
      videosByCategory
      videosHash
    }
  }
`

const WrappedListVideo = graphql(GET_LISTVIDEO, {
  props: ({ loading, error, data: { state: { category, videosByCategory, videosHash } } }) => {
    // console.log("WrappedListVideo", category, videosByCategory, videosHash)
    if (loading) {
      return { loading }
    }
    if (error) {
      return { error }
    }
    const slugs = videosByCategory[category] || []
    const videos = slugs.map(slug => videosHash[slug])
    return { loading: false, videos }
  }
})(ListVideo)

export default WrappedListVideo
// export default connect(mapState)(ListVideo)
