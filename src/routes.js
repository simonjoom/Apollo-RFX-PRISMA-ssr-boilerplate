import { redirect, notFound } from 'rfx/actions'
import { fetchData } from './utils'

const jwToken = null;

const fetchapp = async path => {
  await new Promise(res => setTimeout(res, 500))
  const category = path.replace('/api/category/', '')
  
  switch (category) {
    case 'redux':
      return ['reselect', 'recompose', 'redux-first-router']
    case 'react':
      return [
        'react-router',
        'react-transition-group',
        'react-universal-component'
      ]
    default:
      return []
  }
}

export default {
  HOME: {
    path: '/',
    onEnter: () => {
    //  console.log(document.querySelector('.Home__content--319uD'))
    },
    beforeEnter: async req => {
      if (typeof window !== 'undefined' && window.foo) {
        await new Promise(res => setTimeout(res, 3000)).catch(console.log)
      }
      
      if (typeof window !== 'undefined' && window.foo) {
        const res = await req.dispatch({
          type: 'LIST',
          params: {category: 'react'}
        })
      }
    }
    // beforeLeave: async ({ type }) => {
    //   return false
    //   await new Promise(res => setTimeout(res, 10000))
    //   return type === 'NOT_FOUND'
    // }
  },
  PATHLESS: () => console.log('PATHLESS'),
  LIST: {
    path: '/list/:category',
    thunk: async ({params}) => {
      const {category} = params
      const packages = await fetchapp(`/api/category/${category}`)
      
      if (packages.length === 0) {
        return {
          type: 'LIST',
          params: {category: 'redux'}
        }
      }
      
      return {category, packages}
    }
  },
  VIDEOLIST: {
    path: '/videos/:category',
    thunk: async ({action, getState, params}) => {
      const {category} = params
      //const { jwToken } = getState()
      const videos = await fetchData(`/api/videos/${category}`, jwToken)
      return videos.length > 0 ? {videos, category} : notFound()
    }
  },
  VIDEO: {
    path: '/video/:slug',
    thunk: async ({action, getState}) => {
      console.log("actionVIDEO", action);
      const {slug} = action.params
      // const { jwToken } = getState()
      const video = await fetchData(`/api/video/${slug}`, jwToken)
      
      return video ? {slug, video} : notFound()
    }
  },
  PLAY: {
    path: '/video/:slug/play',
    thunk: 'VIDEO'
  },
  LOGIN: '/login',
  ADMIN: {
    path: '/admin', // TRY: visit this path or dispatch ADMIN
    role: 'admin' // + change jwToken to 'real' in server/index.js
  }
}

// this is essentially faking/mocking the fetch api
// pretend this actually requested data over the network

