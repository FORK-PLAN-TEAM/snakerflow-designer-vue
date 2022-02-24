<template>
  <div style="height: 60vh;overflow-y:scroll;">
     <vue-json-pretty  :data="graphData"></vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
export default {
  components: {
    VueJsonPretty
  },
  props: {
    graphData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleSubmit () {},
    handleClose () {

    }
  }
}
</script>

<style>

</style>
