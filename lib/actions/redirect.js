// @flow
import type { Action } from '../flow-types'

export default (action: Action, status: number = 302) => {
  return {
    ...action,
    location: {
      ...action.location,
      status,
      kind: 'replace'
    }
  }
}
