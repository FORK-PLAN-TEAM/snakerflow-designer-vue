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
          <el-dropdown @command="handleCommand" style="float: right; padding: 3px 0">
            <el-button type="text">添加<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :icon="item.icon" :key="item.name" v-for="item in dropdownData" :command="item.name">
                {{item.label}}
              </el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div>
         <el-row v-for="item in attrList" :key="item.key" style="margin-bottom: 12px;">
           <el-col :span="10" style="height: 32px;display: flex;align-items: center;position: relative;z-index: 99999;">
             <span>{{getLabel(item.key)}}&nbsp;
               <el-tooltip :content="getTooltip(item.key)">
                <i class="el-icon-info"></i>
               </el-tooltip>
             </span>
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
    },
    extendAttrConfig: { // 扩展属性配置
      type: Object
    }
  },
  data () {
    return {
      form: this.value,
      attrKey: '',
      field: this.value.field || {},
      mDropdownData: [
        {
          label: '用户标识',
          name: 'userKey',
          icon: '',
          tips: '参与者处理类可根据用户标识获取参与者'
        },
        {
          label: '用户组标识',
          name: 'groupKey',
          icon: '',
          tips: '参与者处理类可根据用户组标识获取参与者'
        },
        {
          label: '候选用户',
          name: 'candidateUsers',
          icon: '',
          tips: '候选用户(提供给上一节点选择下一节点参与者的用户标识)'
        },
        {
          label: '候选用户组',
          name: 'candidateGroups',
          icon: '',
          tips: '候选用户组(提供给上一节点选择下一节点参与者的用户组标识)'
        },
        {
          label: '候选人处理类',
          name: 'candidateHandler',
          icon: '',
          tips: '获取候选人的处理类'
        },
        {
          label: '额外属性1',
          name: 'attr1',
          icon: '',
          tips: '其他扩展属性1'
        },
        {
          label: '额外属性2',
          name: 'attr2',
          icon: '',
          tips: '其他扩展属性2'
        },
        {
          label: '额外属性3',
          name: 'attr3',
          icon: '',
          tips: '其他扩展属性3'
        }
      ]
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
    },
    dropdownData () {
      if (!this.extendAttrConfig || !this.extendAttrConfig.items || !this.extendAttrConfig.items.length) {
        return this.mDropdownData
      }
      return this.extendAttrConfig.items
    }
  },
  watch: {
    form: {
      handler (n) {
        this.$emit('change', n)
      },
      deep: true
    },
    value: {
      handler (n) {
        this.form = n
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
    handleCommand (command) {
      this.$set(this.field, command, '')
    },
    handleRemoveFieldAttr (key) {
      this.$delete(this.field, key)
    },
    getLabel (name) {
      const res = this.dropdownData.find(item => {
        return item.name === name
      })
      if (res) {
        return res.label
      }
      return ''
    },
    getTooltip (name) {
      const res = this.dropdownData.find(item => {
        return item.name === name
      })
      if (res) {
        return res.tips || res.label
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
