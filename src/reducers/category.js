export default (state = '', action = {}) =>
  (action.type === 'LIST'||action.type === 'VIDEOLIST') ? action.params.category : state
