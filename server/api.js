/*******************************************************************************
 * Copyright (c) SkiScool
 ******************************************************************************/

export const findVideos = async (category, jwToken) => {
  await fakeDelay(1000)
 // if (!jwToken) return [] // in a real app, you'd authenticate

  switch (category) {
    case 'fp':
      return fpVideos
    case 'react-redux':
      return reactReduxVideos
    case 'db-graphql':
      return dbGraphqlVideos
    default:
      return []
  }
}

export const findVideo = async (slug, jwToken) => {
  await fakeDelay(500)
//  if (!jwToken) return null // TRY: set the cookie === ''

  return allVideos.find(video => video.slug === slug)
}


const allVideos = reactReduxVideos.concat(dbGraphqlVideos, fpVideos)
