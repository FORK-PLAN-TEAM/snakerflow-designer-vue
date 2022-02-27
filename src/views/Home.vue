<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner ref='designer' v-model="flowData" @on-save="handleSave"/>
  </div>
</template>

<script>
import SnakerFlowDesigner from '@/components/snakerflow/index'
const demoData = require('@/components/snakerflow/data.json').data
export default {
  name: 'Home',
  components: {
    SnakerFlowDesigner
  },
  data () {
    return {
      flowData: demoData,
      isIFrame: window.parent !== window
    }
  },
  mounted () {
    // 监听消息-第三方使用
    this.initMessageListener()
  },
  methods: {
    // 初始化消息监听
    initMessageListener () {
      if (this.isIFrame) {
        window.addEventListener('message', e => {
          if (e.data && ['in', 'out'].includes(e.data.type)) { // 收到消息，要回复一下
            if (window.parent) {
              window.parent.postMessage({
                success: true,
                type: 'in' // 接收到消息in,传消息out
              }, '*')
            }
            if (e.data.json) {
              this.$refs.designer.importJson(e.data.json)
            } else if (e.data.xml) {
              this.$refs.designer.importXml(e.data.xml)
            }
          }
        })
      }
    },
    handleSave (data) {
      if (this.isIFrame) {
        window.parent.postMessage({
          success: true,
          type: 'out',
          json: JSON.stringify(data.json),
          xml: data.xml
        }, '*')
      } else {
        console.log(data)
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
