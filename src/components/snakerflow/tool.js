/**
 * 节点样式处理方法
 * @param {*}} _this
 * @param {*} style
 * @returns
 */
export const nodeStyleHandle = (_this, style) => {
  if (_this.properties.state === 'active') {
    style.stroke = '#00ff00'
  } else if (_this.properties.state === 'history') {
    style.stroke = '#ff0000'
  }
  return style
}
/**
 * 边样式处理方法
 * @param {*}} _this
 * @param {*} style
 * @returns
 */
export const edgeStyleHandle = (_this, style) => {
  if (_this.properties.state === 'active') {
    style.stroke = '#00ff00'
  } else if (_this.properties.state === 'history') {
    style.stroke = '#ff0000'
  }
  return style
}
