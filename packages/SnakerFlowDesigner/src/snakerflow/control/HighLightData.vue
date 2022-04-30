<template>
  <div style="height:440px;overflow-y:scroll;">
    <el-input v-model="highLightJsonStr" :rows="20" type="textarea"></el-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      highLightJsonStr: ''
    }
  },
  methods: {
    handleSubmit () {
    },
    handleClose () {
      this.highLightJsonStr = ''
    }
  }
}
</script>

<style>

</style>
