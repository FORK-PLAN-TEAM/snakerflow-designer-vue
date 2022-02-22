<template>
  <div>
      <el-drawer
        ref="drawer"
        title="设置节点属性"
        destroy-on-close
        :visible.sync="drawer"
        direction="rtl"
        :append-to-body="true"
        :before-close="handleClose">
        <component :is="node?node.type.replace('snaker:','snaker-'):''" v-model="form"></component>
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

export default {
  components: {
    SnakerStart,
    SnakerEnd,
    SnakerCustom,
    SnakerDecision,
    SnakerTask,
    SnakerTransition
  },
  props: {
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
    }
  },
  data () {
    return {
      drawer: false,
      form: {},
      nodeId: undefined
    }
  },
  watch: {
    node (n) {
      if (n) {
        this.nodeId = n.id
        this.form = {
          name: n.id,
          displayName: n.text instanceof Object ? n.text.value : n.text,
          ...n.properties
        }
      }
    },
    'form.name' (n) {
      // 监听名称变量并更新
      this.lf.changeNodeId(this.nodeId, n)
      this.nodeId = n
    },
    'form.displayName' (n) {
      // 监听显示名称变化并更新
      this.lf.updateText(this.nodeId, n)
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
      this.lf.setProperties(this.nodeId, {
        expireTime: n
      })
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
