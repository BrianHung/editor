import { wrapIn, lift } from 'prosemirror-commands'
import { nodeIsActive } from '../utils'

export default function toggleWrap(type, attrs) {
  return (state, dispatch) => {
    nodeIsActive(state, type, attrs)
      ? lift(state, dispatch)
      : wrapIn(type, attrs)(state, dispatch)
  }
}
