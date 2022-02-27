<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
  </div>
</template>
<script>
import SnakerFlowDesigner from '@/components/snakerflow/index'
const demoData = require('@/components/snakerflow/data.json').data
export default {
  components: {
    SnakerFlowDesigner
  },
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
