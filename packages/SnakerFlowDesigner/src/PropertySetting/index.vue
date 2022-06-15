<template>
  <div>
      <el-drawer
        ref="drawer"
        :title="title"
        destroy-on-close
        :visible.sync="drawer"
        direction="rtl"
        :append-to-body="true"
        :before-close="handleClose">
        <component :is="node?node.type.replace('snaker:','snaker-'):''" v-model="form" :extendAttrConfig="extendAttrConfig"></component>
        </el-drawer>
  </div>
</template>

<script>
import SnakerStart from './start'
import SnakerEnd from './end'
import SnakerCustom from './custom'
import SnakerDecision from './decision'
import SnakerTask from './task'
import SnakerTransition from './transition'
import SnakerProcess from './process'
import SnakerJoin from './join'
import SnakerFork from './fork'

export default {
  components: {
    SnakerStart,
    SnakerEnd,
    SnakerCustom,
    SnakerDecision,
    SnakerTask,
    SnakerTransition,
    SnakerProcess,
    SnakerJoin,
    SnakerFork
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    node: {
      type: Object,
      default () {
        return {}
      }
    },
    lf: {
      type: Object,
      default () {
        return null
      }
    },
    extendAttrConfig: { // 扩展属性配置
      type: Object
    }
  },
  data () {
    return {
      drawer: false,
      form: {},
      nodeId: undefined
    }
  },
  computed: {
    title () {
      if (this.node && this.node.type === 'snaker:transition') {
        return '设置边属性'
      } else if (this.node && this.node.type === 'snaker:process') {
        return '设置流程属性'
      }
      return '设置节点属性'
    }
  },
  watch: {
    node (n) {
      if (n) {
        if (n.type === 'snaker:process') {
          this.form = n
        } else {
          this.nodeId = n.id
          this.form = {
            name: n.id,
            displayName: n.text instanceof Object ? n.text.value : n.text,
            ...n.properties
          }
        }
      }
    },
    'form.name' (n, o) {
      // 监听名称变量并更新
      if (this.node.type === 'snaker:process') {
        this.$emit('input', {
          ...this.value,
          name: n
        })
      } else {
        if (n && o) {
          if (['snaker:transition'].includes(this.node.type)) {
            if (!this.lf.getEdgeModelById(n)) {
              this.lf.changeEdgeId(o, n)
            }
          } else if (['snaker:decision'].includes(this.node.type)) {
            if (!this.lf.getNodeModelById(n)) {
              this.lf.changeNodeId(o, n)
            }
          } else {
            if (!this.lf.getNodeModelById(n)) {
              this.lf.changeNodeId(o, n)
            }
          }
          this.nodeId = n
        }
      }
    },
    'form.displayName' (n) {
      // 监听显示名称变化并更新
      if (this.node.type === 'snaker:process') {
        this.$emit('input', {
          ...this.value,
          displayName: n
        })
      } else {
        this.lf.updateText(this.nodeId, n)
      }
    },
    'form.form' (n) {
      // 监听表单属性变化并更新
      this.lf.setProperties(this.nodeId, {
        form: n
      })
    },
    'form.assignee' (n) {
      // 监听参与者属性变化并更新
      this.lf.setProperties(this.nodeId, {
        assignee: n
      })
    },
    'form.assignmentHandler' (n) {
      // 监听参与者处理类属性变化并更新
      this.lf.setProperties(this.nodeId, {
        assignmentHandler: n
      })
    },
    'form.taskType' (n) {
      // 监听任务类型属性变化并更新
      this.lf.setProperties(this.nodeId, {
        taskType: n
      })
    },
    'form.performType' (n) {
      // 监听参与类型属性变化并更新
      this.lf.setProperties(this.nodeId, {
        performType: n
      })
    },
    'form.preInterceptors' (n) {
      // 监听前置拦截器属性变化并更新
      this.lf.setProperties(this.nodeId, {
        preInterceptors: n
      })
    },
    'form.postInterceptors' (n) {
      // 监听后置拦截器属性变化并更新
      this.lf.setProperties(this.nodeId, {
        postInterceptors: n
      })
    },
    'form.reminderTime' (n) {
      // 监听提醒时间属性变化并更新
      this.lf.setProperties(this.nodeId, {
        reminderTime: n
      })
    },
    'form.reminderRepeat' (n) {
      // 监听重复提醒间隔属性变化并更新
      this.lf.setProperties(this.nodeId, {
        reminderRepeat: n
      })
    },
    'form.expireTime' (n) {
      // 监听期待完成时间属性变化并更新
      if (this.node.type === 'snaker:process') {
        this.$emit('input', {
          ...this.value,
          expireTime: n
        })
      } else {
        this.lf.setProperties(this.nodeId, {
          expireTime: n
        })
      }
    },
    'form.autoExecute' (n) {
      // 监听是否自动完成属性变化并更新
      this.lf.setProperties(this.nodeId, {
        autoExecute: n
      })
    },
    'form.callback' (n) {
      // 监听回调处理属性变化并更新
      this.lf.setProperties(this.nodeId, {
        callback: n
      })
    },
    'form.expr' (n) {
      // 监听决策表达式属性变化并更新
      this.lf.setProperties(this.nodeId, {
        expr: n
      })
    },
    'form.handleClass' (n) {
      // 监听处理类属性变化并更新
      this.lf.setProperties(this.nodeId, {
        handleClass: n
      })
    },
    'form.clazz' (n) {
      // 监听类路径属性变化并更新
      this.lf.setProperties(this.nodeId, {
        clazz: n
      })
    },
    'form.methodName' (n) {
      // 监听方法名属性变化并更新
      this.lf.setProperties(this.nodeId, {
        methodName: n
      })
    },
    'form.args' (n) {
      // 监听参数变量属性变化并更新
      this.lf.setProperties(this.nodeId, {
        args: n
      })
    },
    'form.instanceUrl' (n) {
      // 监听流程实例启动Url变量属性变化并更新
      this.$emit('input', {
        ...this.value,
        instanceUrl: n
      })
    },
    'form.instanceNoClass' (n) {
      // 监听流程实例编号生成类变量属性变化并更新
      this.$emit('input', {
        ...this.value,
        instanceNoClass: n
      })
    },
    'form.field' (n) {
      // 监听扩展属性变化并更新
      this.lf.setProperties(this.nodeId, {
        field: n
      })
    },
    'form.width' (n) {
      // 宽度
      this.lf.setProperties(this.nodeId, {
        width: Number.isNaN(n) ? 120 : n
      })
      const nodeModel = this.lf.getNodeModelById(this.nodeId)
      if (nodeModel) {
        nodeModel.width = Number.isNaN(n) ? 120 : n
      }
    },
    'form.height' (n) {
      // 高度
      this.lf.setProperties(this.nodeId, {
        height: Number.isNaN(n) ? 120 : n
      })
      const nodeModel = this.lf.getNodeModelById(this.nodeId)
      if (nodeModel) {
        nodeModel.height = Number.isNaN(n) ? 80 : n
      }
    }
  },
  methods: {
    show () {
      this.drawer = true
    },
    handleClose () {
      this.drawer = false
    }
  }
}
</script>

<style>

</style>
