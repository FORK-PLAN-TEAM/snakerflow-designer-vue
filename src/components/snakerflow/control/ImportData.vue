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
    },
    handleClose () {
      this.graphJsonStr = ''
    }
  }
}
</script>

<style>

</style>
