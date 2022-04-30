<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner ref='designer' v-model="flowData" @on-save="handleSave"/>
  </div>
</template>

<script>
const demoData = require('../assets/data.json')
export default {
  name: 'Home',
  data () {
    return {
      flowData: window.localStorage.getItem('LFDATA') ? JSON.parse(window.localStorage.getItem('LFDATA')) : demoData,
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
        this.$message.success('保存本地成功')
        window.localStorage.setItem('LFDATA', JSON.stringify(data.json))
        if (data.json.name && data.json.displayName) {
          // 以一定规则存入，方便选择导入
          window.localStorage.setItem(`LFDATA###${data.json.name}###${data.json.displayName}`, JSON.stringify(data.json))
          // 触发更新
          if (this.$refs.designer.refreshLfData === 1) {
            this.$refs.designer.refreshLfData = 2
          } else {
            this.$refs.designer.refreshLfData = 1
          }
        }
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
