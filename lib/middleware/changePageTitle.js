import { isServer } from '../utils'

export default (api) => async (req, next) => {
  const title = req.getTitle()

  if (!isServer() && typeof title === 'string') {
    window.document.title = title
  }

  return next()
}
