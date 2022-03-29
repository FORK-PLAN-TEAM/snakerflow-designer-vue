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
      <el-card>
        <div slot="header" class="clearfix">
          <span>扩展属性</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddFieldAttr">添加</el-button>
        </div>
        <div>
         <el-row v-for="item in attrList" :key="item.key" style="margin-bottom: 12px;">
           <el-col :span="10" style="height: 32px;display: flex;align-items: center;position: relative;z-index: 99999;">
             <div @click="handleDbClick(item.key)">
               <el-input :ref="item.key" v-model="attrKey" size="small" v-if="attrKey && attrKey==item.key" @blur="handleAttrKeyBlur"/>
               <span v-else>{{item.key}}</span>
             </div>
           </el-col>
           <el-col :span="12">
             <el-input v-model="field[item.key]" size="small"></el-input>
           </el-col>
           <el-col :span="2" style="height: 32px;display: flex;align-items: center;padding-left: 10px;">
             <i class="el-icon-remove" @click="handleRemoveFieldAttr(item.key)"></i>
           </el-col>
         </el-row>
        </div>
      </el-card>
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
      form: this.value,
      attrKey: '',
      field: this.value.field || {}
    }
  },
  computed: {
    attrList () {
      if (!this.field) {
        return []
      }
      return Object.keys(this.field).map(key => {
        return {
          key: key,
          value: this.field[key]
        }
      })
    }
  },
  watch: {
    form: {
      handler (n) {
        this.$emit('change', n)
      },
      deep: true
    },
    field: {
      handler (n) {
        this.$set(this.form, 'field', JSON.parse(JSON.stringify(this.field)))
      },
      deep: true
    }
  },
  methods: {
    handleAddFieldAttr () {
      this.$set(this.field, 'attr' + (this.attrList.length + 1), '')
    },
    handleRemoveFieldAttr (key) {
      this.$delete(this.field, key)
    },
    handleDbClick (key) {
      this.attrKey = key
      this.$nextTick(() => {
        this.$refs[key][0].focus()
      })
    },
    handleAttrKeyBlur () {
      this.attrKey = ''
    }
  }
}
</script>

<style scoped>

</style>
