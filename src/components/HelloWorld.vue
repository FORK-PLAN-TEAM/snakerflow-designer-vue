<template>
  <div class="hello">
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted () {
    const data = {
      // 点集
      nodes: [{
        id: 'start1',
        label: '开始',
        type: 'begin',
        x: 24,
        y: 124
      }, {
        id: 'end1',
        label: '结束',
        type: 'end',
        x: 570,
        y: 124
      }, {
        id: 'apply',
        type: 'rect',
        label: '请假申请',
        x: 117,
        y: 122
      }, {
        id: 'approveDept',
        type: 'rect',
        label: '部门经理审批',
        x: 272,
        y: 122
      }, {
        id: 'decision1',
        label: '决策',
        x: 426,
        y: 124
      }, {
        id: 'approveBoss',
        label: '总经理审批',
        type: 'rect',
        x: 404,
        y: 231
      }],
      // 边集
      edges: [{
        source: 'start1', // String，必须，起始点 id
        target: 'apply' // String，必须，目标点 id
      }, {
        source: 'apply',
        target: 'approveDept'
      }, {
        source: 'approveDept',
        target: 'decision1'
      }, {
        source: 'decision1',
        target: 'approveBoss',
        label: '>2天'
      }, {
        source: 'approveBoss',
        target: 'end1'
      }, {
        source: 'decision1',
        target: 'end1',
        label: '<=2天'
      }]
    }
    G6.registerNode('customNode', {
      anchor: [
        [0.5, 1], // 底边中点
        [0.5, 0] // 上边中点
      ]
    })

    const graph = new G6.Graph({
      container: 'mountNode',
      width: 800,
      height: 800,
      defaultNode: {
        shape: 'rect',
        style: {
          fill: '#fff',
          fontSize: 14
        }
      },
      defaultEdge: {
        shape: 'line-with-arrow',
        style: {
          endArrow: true,
          lineWidth: 2,
          stroke: '#ccc'
        }
      }
    })
    graph.data(data) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mountNode{
  border: 1px solid red;
}
</style>
