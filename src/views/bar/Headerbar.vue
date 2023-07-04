<template>
<div class="header">
<strong class="title" v-loading.fullscreen.lock="fullscreenLoading">物业后台管理系统</strong>
        <div class="user-setting">
          <el-avatar size="small" :icon="userInfo.icon" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item  @click.native="logOut()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
</div>
        


</template>

<script>
export default {
  name: 'Headerbar',
  data() { 
    return {
      userInfo:[],
      fullscreenLoading:true,
    }
  },
  created(){
    this.getUserInfo()
  },
  methods:{
    getUserInfo(){
      this.$axios.get('/admin/userInfo').then(res => {
        
				this.userInfo = res.data.data
        this.$store.commit("SET_USERID",this.userInfo.id)
        this.fullscreenLoading = false;
        if(this.userInfo.avatar === null){
          this.userInfo.icon="el-icon-user-solid"
        }
			})
    },
    
    logOut(){
      
      this.$axios.post("/logout").then(res=>{
        localStorage.clear();
        sessionStorage.clear();
        this.$store.commit("resetState")
        this.$router.push("/login")
        this.$message({
						showClose: true,
						message: res.data.msg,
						type: 'success',
					});
      })
    }
  },
  mounted() {

  },
 }
</script>

<style scoped>
.header{

}
.title {
  text-align: center;
  color: #606266;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-weight:normal;
}
.el-avatar {
  margin-left: 90px;
}
.user-setting {
  float: right;
  width: 200px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #606266;
  text-align: center;
  line-height: 60px;
}
div{
  margin: 0;
  padding: 0;
}
</style>