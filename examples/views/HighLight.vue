<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner :highLight="highLight" :viewer="false" ref='designer' v-model="flowData"/>
  </div>
</template>
<script>
const demoData = require('../assets/data.json')
export default {
  data () {
    return {
      flowData: demoData,
      highLight: {
        historyNodeNames: [
          'start',
          'apply'
        ],
        historyEdgeNames: [
          '3037be41-5682-4344-b94a-9faf5c3e62ba',
          'c79642ae-9f28-4213-8cdf-0e0d6467b1b9'
        ],
        activeNodeNames: [
          'approveDept'
        ]
      }
    }
  }
}
</script>
<style scoped>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
</style>
