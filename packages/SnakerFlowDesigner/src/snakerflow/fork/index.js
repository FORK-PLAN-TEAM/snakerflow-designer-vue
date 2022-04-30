import { h, PolygonNode, PolygonNodeModel } from '@logicflow/core'
import { nodeStyleHandle } from '../tool'

class ForkModel extends PolygonNodeModel {
  static extendKey = 'ForkModel';
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

class ForkView extends PolygonNode {
  static extendKey = 'ForkNode';
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
          'm29.29582,12.68919c0.076527,0 0.150415,0.018026 0.211109,0.051074l5.938747,3.219638a0.362843,0.275397 0 0 1 0,0.448646l-5.937428,3.219638a0.362843,0.275397 0 0 1 -0.575271,-0.224323l-0.001319,-2.208181l-7.359771,0c-0.211109,0 -0.440689,0.175252 -0.488189,0.443639l-0.009236,0.105151l0,10.919731c0,0.290418 0.204511,0.498718 0.416939,0.540779l0.079166,0.008012l7.36241,0l0,-2.198167a0.362843,0.275397 0 0 1 0.573951,-0.224323l5.938747,3.219638a0.362843,0.275397 0 0 1 0,0.448646l-5.937428,3.219638a0.362843,0.275397 0 0 1 -0.575271,-0.224323l-0.001319,-2.238224l-7.359771,0c-1.698104,0 -3.026769,-1.075549 -3.129684,-2.387439l-0.006597,-0.164237l-0.001319,-4.458423l-4.240643,0a3.959604,3.005329 0 1 1 0,-2.002885l4.240643,0l0,-4.458423c0,-1.328914 1.261373,-2.45754 2.927812,-2.545667l0.20847,-0.006009l7.359771,0l0.002639,-2.22821c0,-0.152219 0.16229,-0.275397 0.362843,-0.275397z',
        ...style
      })
    )
  }
}

const Fork = {
  type: 'snaker:fork',
  view: ForkView,
  model: ForkModel
}

export { ForkView, ForkModel }
export default Fork
