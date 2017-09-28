import * as T from '../mutation-types'

export const getList = ({ dispatch, state }, lists) => {
  dispatch(T.GETLIST, lists)
}
