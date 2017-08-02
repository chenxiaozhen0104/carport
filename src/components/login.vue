<template>
  <div class="Login-container" v-if="Login">
    <div class="Login-header">
      <div class="header-left">
        <span class="header-title">车库管理系统</span>
        <span class="header-title title-subtext">The garage management system</span>
      </div>
    </div>
    <div class="Login-content">
      <div class="content-details">
        <img src="../assets/Login-img.png" class="Login-img">
        <div class="Login-form">
          <div class="form-title">用户登录</div>
          <div class="form-input">
            <span><i class="iconfont icon-yonghuming"></i></span>
            <input type="texts" class="input-text" placeholder="请输入手机号" v-model="mobile" maxlength="11" @keyup="judgeMobile">
            <p class="iconImg" v-if="hidden">
              <Icon type="checkmark-round" color="green" size='15px' v-if='rightMobile' />
              <Icon type="close-round" color="red" size='15px' v-else/>
            </p>
          </div>
          <div class="form-input">
            <span><i class="iconfont icon-mima"></i></span>
            <input type="password" class="input-text" placeholder="请输入登录密码" v-model="pwd">
          </div>
          <div class="form-input input-remember">
            <input type="checkbox" class="remember" v-model="rememberPassword" id="rememberPwd">
            <label for="rememberPwd">记住密码</label>
          </div>
          <Button type="primary" class="Login-btn" :loading="loading" @click="onsubmit" :disabled='!(mobile&&pwd)'>
              <span v-if="!loading" class="Login-btn-text">登录</span>
              <span v-else class="Login-btn-text">登录中...</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        mobile: '',
        pwd: '',
        rememberPassword: false,
        Login: true,
        loading: false,
        rightMobile: false,
        hidden: false
      }
    },
    methods: {
      onsubmit() {
        var that = this
        that.loading = true
        axios.post('/api/User?phone=' + that.mobile + '&password=' + that.pwd)
          .then(function (res) {
            console.log(res)
            that.loading = false
            if (res.data) {
              localStorage.setItem('Areas', JSON.stringify(res.data.Areas))
              localStorage.setItem('userName', res.data.Name)
              localStorage.setItem('userId', res.data.Id)
              that.$Message.success('登录成功')
              that.$router.push('/equipment')
              if (that.rememberPassword) {
                localStorage.setItem('name', that.mobile)
                localStorage.setItem('password', that.pwd)
              } else {
                localStorage.removeItem('name')
                localStorage.removeItem('password')
              }
            } else {
              console.log('aa')
              that.$Message.error('手机号或密码错误')
              // alert('手机号或密码错误')
            }
          })
      },
      judgeMobile() {
        this.hidden = true
        if (/^1[34578]\d{9}$/.test(this.mobile)) {
          this.rightMobile = true
        } else {
          this.rightMobile = false
        }
      }
    },
    created() {
      var strName = localStorage.getItem('name')
      var strPass = localStorage.getItem('password')
      this.$Notice.config({
        top: 170,
        duration: 0
      })
      if (strName) {
        this.rememberPassword = true
        this.mobile = strName
      }
      if (strPass) {
        this.rememberPassword = true
        this.pwd = strPass
      }
    }
  }

</script>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .Login-container {
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1020;
    display: flex;
    flex-direction: column;
  }

  .ivu-message {
    z-index: 1030;
  }

  .Login-header {
    height: 90px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 35px;
  }

  .header-left {
    height: 43px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
    border-left: 4px solid #19acf9;
  }

  .header-title {
    font-size: 24px;
    color: #333;
  }

  .title-subtext {
    font-size: 18px;
  }
  /*主要内容*/

  .Login-content {
    display: flex;
    flex: 1;
    position: relative;
    align-items: center;
    justify-content: center;
    background: url("../assets/Login-background.png") no-repeat;
    background-size: 100% 100%;
  }

  .content-details {
    margin: 0 auto;
    width: 1200px;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .Login-background {
    position: absolute;
    top: 0;
    left: 0;
  }
  /*登录表单*/

  .Login-form {
    width: 450px;
    height: 510px;
    background-color: #fff;
    text-align: center;
  }

  .form-title {
    height: 85px;
    width: 450px;
    border-bottom: 2px solid #19acf9;
    color: #333;
    font-size: 24px;
    line-height: 85px;
    text-align: center;
  }
  /*输入文本框*/

  .form-input {
    margin: 0 auto;
    border: 2px solid #19acf9;
    margin-top: 33px;
    width: 380px;
    height: 60px;
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
  }

  .form-input span {
    width: 60px;
    height: 60px;
    border-right: 2px solid #19acf9;
    display: block;
    text-align: center;
    line-height: 60px;
  }

  .iconImg {
    width: 40px;
    height: 60px;
    text-align: center;
    line-height: 60px;
  }

  .input-text {
    width: 275px;
    height: 56px;
    border: none;
    padding-left: 20px;
    font-size: 18px;
    color: #333;
    outline: none;
  }

  .icon-yonghuming,
  .icon-mima {
    font-size: 28px;
    color: #19acf9;
    border: none;
    width: 375px;
    height: 58px;
  }
  /*::-webkit-input-placeholder {
    font-size: 18px;
    color: #c0c0c0;
  }*/

  .input-remember {
    margin-top: 20px;
    border: none;
    align-items: center;
    font-size: 16px;
  }

  .remember {
    margin-right: 16px;
  }

  .Login-form .ivu-btn-primary.Login-btn {
    margin: 0 auto;
    margin-top: 40px;
    width: 380px;
    height: 60px;
    background-color: #19acf9;
    color: #fff;
    font-size: 24px;
    border: none;
    opacity: 1;
  }

  .Login-btn:hover {
    background-color: #159de5;
  }

  .Login-btn:disabled,
  .Login-btn:disabled:hover {
    opacity: 0.8;
    background-color: #19acf9;
    color: #fff;
  }
  /*多选框选中后的样式*/

  input[type=checkbox] {
    position: relative;
  }

  input[type=checkbox]:before {
    position: absolute;
    display: block;
    content: " ";
    height: 16px;
    width: 16px;
    top: -2px;
    left: -2px;
    border: 1px solid #888;
    border-radius: 50%;
    background-color: #fff;
  }

  input[type=checkbox]:checked:after {
    position: absolute;
    display: block;
    content: " ";
    top: 0px;
    left: 0px;
    height: 12px;
    width: 12px;
    background-color: #19acf9;
    z-index: 2;
    border-radius: 50%;
  }
</style>