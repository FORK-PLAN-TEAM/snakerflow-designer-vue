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
/**
 * 将snaker的定义文件转成LogicFlow支持的数据格式
 * @param {*} xml
 * @returns
 */
export const snakerXml2LogicFlowJson = (xml) => {
  return {}
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
    displayName: data.name, // 流程定义显示名称
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
        displayName: edge.text instanceof String ? edge.text : edge.text.value,
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
      displayName: node.text instanceof String ? node.text : node.text.value,
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
  // 节点标签
  const NODE_NAMES = ['start', 'task', 'decision', 'end', 'custom', 'join', 'fork']
  // 流程节点属性
  const PROCESS_ATTR_KEYS = ['name', 'displayName', 'instanceUrl', 'expireTime', 'instanceNoClass']
  // 节点属性
  const NODE_ATTR_KEYS = ['name', 'displayName', 'form', 'assignee', 'assignmentHandler', 'taskType', 'performType',
    'preInterceptors', 'postInterceptors', 'reminderTime', 'reminderRepeat',
    'expireTime', 'autoExecute', 'callback', 'expr', 'handleClass',
    'clazz', 'methodName', 'args']
  // 变迁节点属性
  const TRANSITION_ATTR_KEYS = ['name', 'displayName', 'to', 'expr', 'g']
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
