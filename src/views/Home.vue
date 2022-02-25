<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner v-model="flowData"/>
  </div>
</template>

<script>
import SnakerFlowDesigner from '@/components/snakerflow/index'
import { logicFlowJsonToSnakerXml, snakerXml2LogicFlowJson } from '@/components/snakerflow/tool'
const demoData = require('@/components/snakerflow/data.json').data
export default {
  name: 'Home',
  components: {
    SnakerFlowDesigner
  },
  data () {
    return {
      flowData: demoData
    }
  },
  mounted () {
    this.flowData = snakerXml2LogicFlowJson(logicFlowJsonToSnakerXml(demoData))
  }
}
</script>
<style scoped>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
</style>
