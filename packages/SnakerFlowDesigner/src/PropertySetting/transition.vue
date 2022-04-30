<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="表达式">
        <el-input v-model="form.expr"></el-input>
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
