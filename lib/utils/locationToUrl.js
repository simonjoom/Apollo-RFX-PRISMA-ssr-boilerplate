export default (location) => {
  if (typeof location === 'string') return location

  const { pathname, search, hash } = location

  let path = pathname || '/'

  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : `?${search}`
  }

  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : `#${hash}`
  }

  return path
}
