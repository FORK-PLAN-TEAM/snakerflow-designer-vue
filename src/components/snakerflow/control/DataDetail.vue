<template>
  <div style="height: 60vh;overflow-y:scroll;">
    <el-tabs v-model="activeName">
    <el-tab-pane label="json" name="json">
      <vue-json-pretty  :data="json"></vue-json-pretty>
    </el-tab-pane>
    <el-tab-pane label="xml" name="xml">
      <pre style="text-align:left;">{{xml}}</pre>
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { logicFlowJsonToSnakerXml } from '@/components/snakerflow/tool'
export default {
  components: {
    VueJsonPretty
  },
  props: {
    graphData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      activeName: 'json'
    }
  },
  computed: {
    xml () {
      return logicFlowJsonToSnakerXml(this.graphData)
    },
    json () {
      const processAttr = {}
      const PROCESS_ATTR_KEYS = ['name', 'displayName', 'expireTime', 'instanceUrl', 'instanceNoClass']
      PROCESS_ATTR_KEYS.forEach(key => {
        if (!this.graphData[key]) {
          delete this.graphData[key]
        } else {
          processAttr[key] = this.graphData[key]
        }
      })
      return {
        ...processAttr,
        ...this.graphData
      }
    }
  },
  methods: {
    handleSubmit () {},
    handleClose () {

    }
  }
}
</script>

<style>

</style>
