<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
  </div>
</template>
<script>
const demoData = require('../assets/data.json')
export default {
  data () {
    return {
      flowData: demoData
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
