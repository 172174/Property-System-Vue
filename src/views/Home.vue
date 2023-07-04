<template>
  <el-container style="margin: 0; padding: 0">
    <el-aside width="201px">
      <!-- 左侧导航栏 -->
      <Sidebar></Sidebar>
    </el-aside>
    <el-container >
      <el-header class="header" height="40px">
          <Headerbar/>
      </el-header>
      <el-main  >
        <tabs />
        <div class="view-style">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from "./bar/Sidebar.vue";
import Headerbar from "./bar/Headerbar.vue";
import Tabs from "./bar/Tabs.vue";

export default {
  name: "home",
  components: { Sidebar, Headerbar, Tabs },
  data() {
    return {
      isCollapse: true,
     
    };
  },
  created(){
  },
  
  methods: {
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical-demo {
  height: 100%;
}


.el-header,
.el-footer {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 40px;
  border-bottom:1px solid #edeff4;
 
}

.view-style{
  margin-left: 20px;
  margin-right: 20px;
}

.el-container {
  height: 100vh;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>