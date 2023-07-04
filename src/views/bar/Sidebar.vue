<template>
  <el-menu
    :default-active="this.$store.state.menu.editableTabsValue"
    class="el-menu-vertical-demo"
    background-color="#ecf1f7"
    active-text-color="#409EFF"
    @open="handleOpen"
    @close="handleClose"
  >
  <router-link to="/">
    <el-menu-item index="Index"   @click="selectMenu({name:'Index',title:'首页'})">
      <i class="el-icon-s-platform"></i>
      <span slot="title">首页 </span>
    </el-menu-item>
  </router-link>

    <el-submenu :index="menu.name" v-for="(menu,index) in menuList" :key="index">
      <template slot="title" >
        <i :class="menu.icon"></i>
        <span class="menu-title">{{menu.title}}</span>
      </template>

        <router-link :to="item.path" v-for="(item,index) in menu.children" :key="index" >
        <el-menu-item class="menu" :index="item.name" @click="selectMenu(item)" background-color="#0000">
          <i :class="item.icon"></i>
          {{item.title}}</el-menu-item>
        </router-link>

      
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {

    };
  },
  computed:{
    menuList:{
      get(){
        return this.$store.state.menu.menuList
      }
    }
  }
  ,
  components: {},
  methods: {

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    
    selectMenu(item){
      this.$store.commit("addTab",item);
    }
  },
  mounted() {},
};
</script>

<style scoped>
a {
  text-decoration: none;
  
}
 .menu i{
    margin-top:15px ;
 }
 .menu{
   display: flex;
   justify-content:flex-end ;
 }
 
.router-link-active {
  text-decoration: none;
}

el-menu-vertical-demo{
  width: 100%;
}

.icon-tianjia{
  font-size: 19px;
  margin-right: 5px;
}
</style>