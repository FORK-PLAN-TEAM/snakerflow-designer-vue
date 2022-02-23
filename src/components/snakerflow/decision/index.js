import { h, PolygonNode, PolygonNodeModel } from '@logicflow/core'
import { nodeStyleHandle } from '../tool'

class DecisionModel extends PolygonNodeModel {
  static extendKey = 'DecisionModel';
  constructor (data, graphModel) {
    if (!data.text) {
      data.text = ''
    }
    if (data.text && typeof data.text === 'string') {
      data.text = {
        value: data.text,
        x: data.x,
        y: data.y + 40
      }
    }
    super(data, graphModel)
    this.points = [
      [25, 0],
      [50, 25],
      [25, 50],
      [0, 25]
    ]
  }

  getNodeStyle () {
    const style = super.getNodeStyle()
    return nodeStyleHandle(this, style)
  }
}

class DecisionView extends PolygonNode {
  static extendKey = 'DecisionNode';
  getShape () {
    const { model } = this.props
    const { x, y, width, height, points } = model
    const style = model.getNodeStyle()
    return h(
      'g',
      {
        transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`
      },
      h('polygon', {
        ...style,
        x,
        y,
        points
      }),
      h('path', {
        d:
          'm 16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z',
        ...style
      })
    )
  }
}

const Decision = {
  type: 'snaker:decision',
  view: DecisionView,
  model: DecisionModel
}

export { DecisionView, DecisionModel }
export default Decision
