import { isRedirect } from './index'

export default (action, redirectFunc) => {
  if (isRedirect(action)) {
    const url = action.location.url
    const status = action.location.status || 302

    if (typeof redirectFunc === 'function') {
      redirectFunc(status, url, action)
    }
    else if (redirectFunc && typeof redirectFunc.redirect === 'function') {
      redirectFunc.redirect(status, url)
    }

    return true
  }

  return false
}
