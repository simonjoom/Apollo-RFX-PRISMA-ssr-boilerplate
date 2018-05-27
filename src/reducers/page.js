export default (state = 'HOME', action = {}) => components[action.type] || state

const components = {
  HOME: 'Home',
  LIST: 'List',
  VIDEOLIST: 'ListVideo',
  VIDEO: 'Video',
  PLAY: 'Video',
  ADMIN: 'Admin',
  LOGIN: 'Login',
  NOT_FOUND: 'NotFound'
}

// NOTES: this is the primary reducer demonstrating how RFR replaces the need
// for React Router's <Route /> component.
//
// ALSO:  Forget a switch, use a hash table for perf.
