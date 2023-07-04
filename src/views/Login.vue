<template>
  <div>
    <el-card class="login-card" v-loading="loading">
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-loginForm"
      >
        <div class="login-tital" style="text-align: center">
          <span>物业后台登录</span>
        </div>

        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            auto-complete="on"
            style="width: 300px; float: left"
          >
            <span slot="prefix"><i class="el-icon-user"></i></span>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            style="width: 300px; float: left"
          >
            <span slot="prefix"><i class="el-icon-lock"></i></span>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            style="width: 170px; float: left"
          >
            <span slot="prefix"><i class="el-icon-lock"></i></span>
          </el-input>
          <el-image :src="codeImg" class="code-image" @click="changeCodeImg"></el-image>
        </el-form-item>


        <el-form-item
          style="margin-right: 75px; text-align: center"
        >
          <el-button type="primary" @click="submitForm('loginForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import qs from "qs"
export default {
  name: "Login",
  data() {
    return {
      loading:false,
      codeImg:null,
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid:'',
        loginType:0,
      },

      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
    };
  },
  created(){
      this.getImg()
  }
  ,
  methods: {
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$axios.post('/login'+'?'+qs.stringify(this.loginForm)).then(res=>{
            const token = res.data.data.token
            this.$store.commit('SET_TOKEN',token)
            this.loading = false;
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.$router.push("/")

            }).catch(err =>{
            this.loading=false
            this.$message.error(err.data.msg?err.data.msg:'服务器异常，请稍后再试');
            this.changeCodeImg()
          })
          this.changeCodeImg()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getImg(){
        this.$axios.get('/captchaImage').then(res=>{
            
            this.loginForm.uuid = res.data.data.uuid
            this.codeImg = res.data.data.img
        })
    },
    changeCodeImg(){
      this.getImg()
      this.loginForm.code=''
    }
  },
};
</script>

<style scoped>
.demo-loginForm {
  position: relative;
}
.code-image{
    float:left;
    width:110px;
    margin-left:20px ;
    border-radius: 4px;
}
.login-tital {
  margin-bottom: 20px;
}
.login-card {
  position: absolute;
  left: 0;
  right: 0;
  margin: 140px auto;
  border-top: 10px solid #409eff;
  width: 500px;
  height: 300px;
}
</style>