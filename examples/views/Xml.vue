<template>
  <div class="logic-flow-view">
    <SnakerFlowDesigner :highLight="highLight" :viewer="false" ref='designer' v-model="flowData"/>
  </div>
</template>
<script>
const xmlData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<process  name="articleAudit" displayName="文章审核aa" instanceUrl="articleAuditForm">\n\t<start name="start" displayName="开始" layout="360,180,120,80" preInterceptors="com.mldong.modules.cms.wf.interceptor.ArticleStartPreInterceptor">\n\t\t<transition name="t1" to="apply" g="378,180;440,180"></transition>\n\t</start>\n\t<task name="apply" displayName="文章审核申请" layout="500,180,120,80" taskType="Major" performType="ANY" assignee="approve.operator">\n\t\t<transition name="t2" to="approveDept" g="560,180;620,180"></transition>\n\t</task>\n\t<task name="approveDept" displayName="部门领导审批" layout="680,180,120,80" taskType="Major" performType="ANY" assignmentHandler="com.mldong.config.FlowAssignmentHandler">\n\t\t<transition name="t3" to="approveBoss" g="740,180;800,180"></transition>\n\t</task>\n\t<task name="approveBoss" displayName="公司领导审批" layout="860,180,120,80" taskType="Major" performType="ANY" assignmentHandler="com.mldong.config.FlowAssignmentHandler">\n\t\t<transition name="t4" to="end" g="920,180;982,180"></transition>\n\t</task>\n\t<end name="end" displayName="结束" layout="1000,180,120,80" postInterceptors="com.mldong.modules.cms.wf.interceptor.ArticleEndPostIntereptor">\n\t\t</end>\n</process>'
export default {
  data () {
    return {
      flowData: xmlData,
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
