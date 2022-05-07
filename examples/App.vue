<template>
  <div id="app">
    <router-view/>
    <div class="m-button-group-wrap">
      <el-button :disabled="$route.name === 'Home'" type="text" icon="el-icon-edit" @click.native="handleJump('Home')">编辑模式</el-button>
        <el-button :disabled="$route.name === 'Preview'" type="text" icon="el-icon-view" @click.native="handleJump('Preview')">预览模式</el-button>
        <el-button :disabled="$route.name === 'HighLight'" type="text" icon="el-icon-star-on" @click.native="handleJump('HighLight')">高亮模式</el-button>
        <el-button :disabled="$route.name === 'Xml'" type="text" icon="el-icon-copy-document" @click.native="handleJump('Xml')">XML数据</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleJump (name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.m-button-group-wrap {
  width: 100%;
  position: fixed;
  left: 100px;
  bottom: 0;
  z-index: 9999;
}
</style>
