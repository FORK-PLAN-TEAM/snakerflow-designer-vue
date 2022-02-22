import { CircleNode, CircleNodeModel, h } from '@logicflow/core'

class EndModel extends CircleNodeModel {
  static extendKey = 'EndModel';
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
  }

  setAttributes () {
    this.r = 18
  }

  getConnectedSourceRules () {
    const rules = super.getConnectedSourceRules()
    const notAsSource = {
      message: '结束节点不能作为边的起点',
      validate: () => false
    }
    rules.push(notAsSource)
    return rules
  }
}

class EndView extends CircleNode {
  static extendKey = 'EndView';
  getAnchorStyle () {
    return {
      visibility: 'hidden'
    }
  }

  getShape () {
    const { model } = this.props
    const style = model.getNodeStyle()
    const { x, y, r } = model
    const outCircle = super.getShape()
    return h(
      'g',
      {},
      outCircle,
      h('circle', {
        ...style,
        cx: x,
        cy: y,
        r: r - 5
      })
    )
  }
}

const End = {
  type: 'snaker:end',
  view: EndView,
  model: EndModel
}

export { EndView, EndModel }
export default End
