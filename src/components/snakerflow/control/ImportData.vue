<template>
  <div style="height:440px;overflow-y:scroll;">
     <el-input v-model="graphJsonStr" :rows="20" type="textarea"></el-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      graphJsonStr: ''
    }
  },
  methods: {
    handleSubmit () {
      const data = JSON.parse(this.graphJsonStr)
      this.$emit('on-submit', data.data ? data.data : data)
    },
    handleClose () {
      this.graphJsonStr = ''
    }
  }
}
</script>

<style>

</style>
