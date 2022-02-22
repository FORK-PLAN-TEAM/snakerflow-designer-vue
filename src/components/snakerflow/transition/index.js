import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'

class TransitionModel extends PolylineEdgeModel {
  static extendKey = 'TransitionModel';
}

class TransitionView extends PolylineEdge {
  static extendKey = 'TransitionEdge';
}

const Transition = {
  type: 'snaker:transition',
  view: TransitionView,
  model: TransitionModel
}

export { TransitionView, TransitionModel }
export default Transition
