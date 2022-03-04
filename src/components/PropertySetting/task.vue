<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="表单">
        <el-input v-model="form.form"></el-input>
      </el-form-item>
      <el-form-item label="参与者">
        <el-input v-model="form.assignee"></el-input>
      </el-form-item>
      <el-form-item label="参与者处理类">
        <el-input v-model="form.assignmentHandler"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.taskType">
          <el-option value="Major" label="主办任务"></el-option>
          <el-option value="Aidant" label="协办任务"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参与类型">
        <el-select v-model="form.performType">
          <el-option value="ANY" label="普通参与"></el-option>
          <el-option value="ALL" label="会签参与"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前置拦截器">
        <el-input v-model="form.preInterceptors"></el-input>
      </el-form-item>
      <el-form-item label="后置拦截器">
        <el-input v-model="form.postInterceptors"></el-input>
      </el-form-item>
      <el-form-item label="提醒时间">
        <el-input v-model="form.reminderTime"></el-input>
      </el-form-item>
      <el-form-item label="重复提醒间隔">
        <el-input v-model="form.reminderRepeat"></el-input>
      </el-form-item>
      <el-form-item label="期待完成时间">
        <el-input v-model="form.expireTime"></el-input>
      </el-form-item>
      <el-form-item label="是否自动完成">
        <el-select v-model="form.autoExecute">
          <el-option value="N" label="否"></el-option>
          <el-option value="Y" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回调处理">
        <el-input v-model="form.callback"></el-input>
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
