<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>


export default {
  name:"App",
  watch:{
    $route(to,from){
      if(to.path != '/login' && to.path != '/index' && to.path != "/404"){
        let obj ={
          name:to.name,
          title:to.meta.title
        }
        this.$store.commit("addTab",obj)
      }else if(from.path == '/404'){
        this.$store.commit("editableTabsHome")
      }
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
