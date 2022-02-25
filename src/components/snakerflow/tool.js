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
/**
 * 解析xml成Dom对象
 * @param {} xml
 * @returns
 */
export const parseXml2Dom = (xml) => {
  let xmlDoc = null
  if (window.DOMParser) {
    const parser = new DOMParser()
    xmlDoc = parser.parseFromString(xml, 'text/xml')
  } else { // Internet Explorer
    // eslint-disable-next-line no-undef
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
    xmlDoc.async = false
    xmlDoc.loadXML(xml)
  }
  return xmlDoc
}
// 节点标签
const NODE_NAMES = ['start', 'task', 'decision', 'end', 'custom', 'join', 'fork']
// 流程节点属性
const PROCESS_ATTR_KEYS = ['name', 'displayName', 'instanceUrl', 'expireTime', 'instanceNoClass']
// 节点属性
const NODE_ATTR_KEYS = ['name', 'displayName', 'form', 'assignee', 'assignmentHandler', 'taskType', 'performType',
  'preInterceptors', 'postInterceptors', 'reminderTime', 'reminderRepeat',
  'expireTime', 'autoExecute', 'callback', 'expr', 'handleClass',
  'clazz', 'methodName', 'args', 'layout', 'g']
// 变迁节点属性
const TRANSITION_ATTR_KEYS = ['name', 'displayName', 'to', 'expr', 'g']

/**
 * 将snaker的定义文件转成LogicFlow支持的数据格式
 * @param {*} xml
 * @returns
 */
export const snakerXml2LogicFlowJson = (xml) => {
  const graphData = {
    nodes: [],
    edges: []
  }
  const xmlDoc = parseXml2Dom(xml)
  const processDom = xmlDoc.getElementsByTagName('process')
  if (!processDom.length) {
    return graphData
  }
  let value = null
  // 解析process属性
  PROCESS_ATTR_KEYS.forEach(key => {
    value = processDom[0].getAttribute(key)
    if (value) {
      graphData[key] = value
    }
  })
  let nodeEles = null
  let node = null
  let lfNode = {}
  // 解析节点
  NODE_NAMES.forEach(key => {
    nodeEles = processDom[0].getElementsByTagName(key)
    if (nodeEles.length) {
      for (var i = 0, len = nodeEles.length; i < len; i++) {
        node = nodeEles[i]
        lfNode = {
          type: 'snaker:' + key,
          properties: {}
        }
        // 处理节点
        NODE_ATTR_KEYS.forEach(attrKey => {
          value = node.getAttribute(attrKey)
          if (value) {
            if (attrKey === 'name') {
              lfNode.id = value
            } else if (attrKey === 'layout') {
              const attr = value.split(',')
              if (attr.length === 4) {
                lfNode.x = attr[0]
                lfNode.y = attr[1]
                lfNode.properties.width = attr[2] <= 0 ? 100 : attr[2]
                lfNode.properties.height = attr[3] <= 0 ? 50 : attr[3]
              }
            } else if (attrKey === 'displayName') {
              lfNode.text = value
            } else {
              lfNode.properties[attrKey] = value
            }
          }
        })
        graphData.nodes.push(lfNode)
        // 处理边
        let transitionEles = null
        let transitionEle = null
        let edge = {}
        if (key !== 'end') {
          transitionEles = node.getElementsByTagName('transition')
          for (var j = 0, lenn = transitionEles.length; j < lenn; j++) {
            transitionEle = transitionEles[j]
            edge = {}
            edge.id = transitionEle.getAttribute('name')
            edge.type = 'snaker:transition'
            edge.sourceNodeId = lfNode.id
            edge.targetNodeId = transitionEle.getAttribute('to')
            edge.text = {
              value: transitionEle.getAttribute('displayName') ? transitionEle.getAttribute('displayName') : ''
            }
            const g = transitionEle.getAttribute('g')
            if (g) {
              const points = g.split(';')
              if (points.length >= 2) {
                edge.pointsList = []
                points.forEach((item) => {
                  const pointArr = item.split(',')
                  edge.pointsList.push({
                    x: Number(pointArr[0]),
                    y: Number(pointArr[1])
                  })
                })
                edge.startPoint = edge.pointsList[0]
                edge.endPoint = edge.pointsList[edge.pointsList.length - 1]
              }
            }
            graphData.edges.push(edge)
          }
        }
      }
    }
  })

  return graphData
}
/**
 * 将LogicFlow的数据转成snaker的定义文件
 * @param {*} data(...processInfo,nodes,edges)
 * @returns
 */
export const logicFlowJsonToSnakerXml = (data) => {
  // data的数据由流程定义文件信息+logicFlow数据构成
  // 先构建成流程对象
  const processObj = {
    name: data.name, // 流程定义名称
    displayName: data.displayName, // 流程定义显示名称
    instanceUrl: data.instanceUrl, // 实例启动Url
    expireTime: data.expireTime, // 期望完成时间
    instanceNoClass: data.instanceNoClass // 实例编号生成类
  }
  /**
   * 获取开始节点
   * @returns
   */
  const getStartNode = () => {
    return data.nodes.find((node) => {
      return node.type === 'snaker:start'
    })
  }
  /**
   * 获取当前节点的所有下一个节点集合
   * @param {*} id 当前节点名称
   * @returns
   */
  const getNextNodes = (id) => {
    return data.edges.filter(edge => {
      return edge.sourceNodeId === id
    }).map(edge => {
      return data.nodes.find((node) => {
        return node.id === edge.targetNodeId
      })
    })
  }
  /**
   * 获取节点所有输出边
   * @param {*} id
   * @returns
   */
  const getTransitions = (id) => {
    return data.edges.filter((edge) => {
      return edge.sourceNodeId === id
    }).map(edge => {
      return {
        name: edge.id,
        displayName: (edge.text instanceof String || edge.text === undefined) ? edge.text : edge.text.value,
        to: edge.targetNodeId, // 目地节点id
        expr: edge.properties.expr, // 表达式
        g: edge.pointsList.map(point => { // 转换点集合
          return point.x + ',' + point.y
        }).join(';')
      }
    })
  }
  /**
   * 构建节点属性
   * @param {}} node
   * @returns
   */
  const buildNode = (node) => {
    return {
      name: node.id,
      displayName: (node.text instanceof String || node.text === undefined) ? node.text : node.text.value,
      layout: node.x + ',' + node.y + ',' + node.properties.width + ',' + node.properties.height,
      ...node.properties,
      transition: getTransitions(node.id)
    }
  }
  /**
   * 特殊字符转义
   * @param {*} text
   * @returns
   */
  const textEncode = (text) => {
    text = text.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return text
  }
  /**
   * 递归构建节点属性
   * @param {}} node
   */
  const recursionBuildNode = (node) => {
    const nodeName = node.type.replace('snaker:', '')
    processObj[nodeName + '_' + node.id] = buildNode(node)
    const nextNodes = getNextNodes(node.id)
    nextNodes.forEach(nextNode => {
      recursionBuildNode(nextNode)
    })
  }
  const startNode = getStartNode()
  if (!startNode) {
    // 开始节点不存在，xml不合法
    return ''
  }
  recursionBuildNode(startNode)
  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'
  xml += '<process '
  Object.keys(processObj).forEach(key => {
    const value = processObj[key]
    if (PROCESS_ATTR_KEYS.includes(key) && value) {
      xml += ' ' + key + '=' + '"' + textEncode(value) + '"'
    }
  })
  xml += '>\n'
  // 生成节点xml
  Object.keys(processObj).forEach(key => {
    const value = processObj[key]
    const nodeName = key.split('_')[0]
    if (NODE_NAMES.includes(nodeName)) {
      xml += '\t<' + nodeName
      // 构造属性
      Object.keys(value).forEach(nodeAttrKey => {
        if (NODE_ATTR_KEYS.includes(nodeAttrKey) && value[nodeAttrKey]) {
          xml += ' ' + nodeAttrKey + '=' + '"' + textEncode(value[nodeAttrKey]) + '"'
        }
      })
      xml += '>\n\t'
      // 构建transition
      if (value.transition) {
        value.transition.forEach(tran => {
          xml += '\t<transition'
          // transition属性
          Object.keys(tran).forEach(tranAttrKey => {
            if (TRANSITION_ATTR_KEYS.includes(tranAttrKey) && tran[tranAttrKey]) {
              xml += ' ' + tranAttrKey + '=' + '"' + textEncode(tran[tranAttrKey]) + '"'
            }
          })
          xml += '>'
          xml += '</transition>\n'
        })
      }
      xml += '\t</' + nodeName + '>\n'
    }
  })
  xml += '</process>'
  return xml
}
