import { h, PolygonNode, PolygonNodeModel } from '@logicflow/core'
import { nodeStyleHandle } from '../tool'

class JoinModel extends PolygonNodeModel {
  static extendKey = 'JoinModel';
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

class JoinView extends PolygonNode {
  static extendKey = 'JoinNode';
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
          'm31.518769,19.717099l-1.323583,1.821511l2.491935,3.432788l-6.298288,0c-0.559956,-1.545837 -1.84258,-4.576707 -2.311642,-5.729901c-0.956077,-2.351733 -2.717862,-3.448504 -4.123924,-3.545119l-4.962923,0.032205l0,2.54419l4.962549,0c1.097469,0 1.866146,0.687897 2.492683,2.229097c0.47355,1.164015 1.774877,4.396875 2.322863,5.759788a1922.847494,2648.83654 0 0 1 -2.322863,5.757726c-0.626537,1.540684 -1.395214,2.227035 -2.492683,2.227035l-4.962549,0l0,2.576395l4.962549,0c1.780114,0 3.167847,-1.192355 4.124672,-3.545119c0.468687,-1.153709 1.751312,-4.184065 2.311268,-5.729901l6.321106,0l-2.514752,3.46422l1.322648,1.821511l4.760935,-6.55847l-4.759999,-6.557955z',
        ...style
      })
    )
  }
}

const Join = {
  type: 'snaker:join',
  view: JoinView,
  model: JoinModel
}

export { JoinView, JoinModel }
export default Join
