<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="决策表达式">
        <el-input v-model="form.expr"></el-input>
      </el-form-item>
      <el-form-item label="处理类">
        <el-input v-model="form.handleClass"></el-input>
      </el-form-item>
      <el-form-item label="前置拦截器">
        <el-input v-model="form.preInterceptors"></el-input>
      </el-form-item>
      <el-form-item label="后置拦截器">
        <el-input v-model="form.postInterceptors"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: this.value
    }
  },
  watch: {
    form: {
      handler (n) {
        this.$emit('change', n)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
