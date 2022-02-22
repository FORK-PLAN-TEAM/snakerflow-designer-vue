<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="类路径">
        <el-input v-model="form.clazz"></el-input>
      </el-form-item>
      <el-form-item label="方法名">
        <el-input v-model="form.methodName"></el-input>
      </el-form-item>
      <el-form-item label="参数变量">
        <el-input v-model="form.args"></el-input>
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
