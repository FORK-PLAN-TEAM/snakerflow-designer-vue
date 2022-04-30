<template>
  <div>
    <el-form ref="form" :model="form" label-width="130px" size="small">
      <el-form-item label="流程定义名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="流程定义显示名称">
        <el-input v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="期望完成时间">
        <el-input v-model="form.expireTime"></el-input>
      </el-form-item>
      <el-form-item label="实例启动Url">
        <el-input v-model="form.instanceUrl"></el-input>
      </el-form-item>
      <el-form-item label="实例编号生成类">
        <el-input v-model="form.instanceNoClass"></el-input>
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
