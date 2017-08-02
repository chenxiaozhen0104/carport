<template>
  <div id="app">
    <div class="appHeader">
      <div class="appHeader-left">
        <span class="appHeader-title">车库管理系统</span>
        <span class="appHeader-title title-subtext">The garage management system</span>
      </div>
      <div class="appHeader-right">
        <p class="showTime">
          <i class="iconfont icon-shijian"></i>
          <span>{{nowTime|datetime('yyyy年MM月dd日 hh:mm:ss')}}</span>
        </p>
        <div class="appHeader-touxiang">
          <i class="iconfont icon-touxiang1"></i>
          <span class="userName" v-html="userName"></span>
          <i class="iconfont icon-menu-open"></i>
          <p class="backLogin" @click="quit">
            <i class="iconfont icon-tuichu"></i>
            <span>退出</span>
          </p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="container-left">
        <router-link class="router-lists" to="/equipment"><i class="iconfont icon-shebeiguanli icontColors"></i>设备管理</router-link>
        <router-link class="router-lists" to="/recode"> <i class="iconfont icon-shenqingjilu icontColors"></i>申请记录</router-link>
        <router-link class="router-lists" to="/video"> <i class="iconfont icon-shipinguanli icontColors"></i>相机管理</router-link>
        <router-link class="router-lists" to="/user"><i class="iconfont icon-user icontColors"></i>用户管理</router-link>
        <router-link class="router-lists" to="/area"><i class="iconfont icon-quyuguanli icontColors"></i>区域管理</router-link>
        <router-link class="router-lists" to="/inout"> <i class="iconfont icon-lishijilu icontColors"></i>历史记录</router-link>
        <router-link class="router-lists" to="/system"> <i class="iconfont icon-xitongshezhi icontColors"></i>系统设置</router-link>
      </div>
      <div class="container-right">
        <transition name="fade" mode="out-in">
          <router-view v-if="show"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        modal10: false,
        nowTime: new Date(),
        userName: '',
        wraningMsg: this.$store.state.warningMessage,
        show: true
      }
    },
    methods: {
      quit() {
        var self = this
        self.$Modal.confirm({
          content: '<p>确定退出登录</p>',
          onOk: () => {
            localStorage.removeItem('userId')
            self.$router.push('/Login')
            location.reload()
            // this.$Message.info('点击了确定')
          },
          onCancel: () => {
            // this.$Message.info('点击了取消')
          }
        })
      },
      setTime() {
        setInterval(() => {
          this.nowTime = new Date()
        }, 1000)
      }
    },
    created() {
      this.setTime()
      this.userName = localStorage.getItem('userName')
      this.$watch('wraningMsg.id', (oldVal, newVal) => {
        console.log('显示警报')
        this.$Notice[this.wraningMsg.content.type](this.wraningMsg.content)
      })
    }
  }

</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }

  html,
  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif, '微软雅黑';
    width: 100%;
    height: 100%;
    font-size: 16px !important;
    line-height: normal !important;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  /*头部样式*/

  .appHeader {
    height: 90px;
    width: 100%;
    background-color: #19acf9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px 0 35px;
  }

  .appHeader-left {
    height: 43px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
    border-left: 4px solid #fff;
  }

  .appHeader-title {
    font-size: 24px;
    color: #fff;
  }

  .title-subtext {
    font-size: 18px;
  }

  .appHeader-right {
    height: 43px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 400px;
    align-items: center;
    position: relative;
  }

  .userName {
    color: #fff;
    margin: 0 5px;
  }

  .showTime,
  .appHeader-touxiang {
    display: flex;
    align-items: center;
  }

  .showTime {
    color: #fff;
    margin-right: 40px;
  }

  .icon-tuichu {
    font-size: 20px;
    color: #19acf9;
  }

  .icon-shijian {
    font-size: 22px;
    color: #fff;
    margin-right: 10px;
  }

  .icon-menu-open {
    color: #fff;
  }

  .icon-touxiang1 {
    font-size: 32px;
    color: #fff;
  }

  .backLogin {
    transition: all 400ms;
    background-color: #fff;
    color: #19acf9;
    position: absolute;
    right: 0;
    bottom: -30px;
    padding: 5px 10px;
    width: 80px;
    opacity: 0;
    transform: translateY(-100%);
    border-radius: 5px;
    cursor: pointer;
    -webkit-box-shadow: 0 0 2px 2px rgba(150, 150, 150, 0.3);
    -moz-box-shadow: 0 0 2px 10px rgba(150, 150, 150, 0.3);
    box-shadow: 0 0 2px 2px rgba(150, 150, 150, 0.3);
    z-index: 10
  }

  .appHeader-touxiang:hover .backLogin {
    opacity: 1;
    transform: translateY(0);
  }
  /*内容部分*/
  /*内容左侧样式*/

  .container {
    height: auto;
    display: flex;
    justify-content: space-between;
    background-color: #f5f5f5;
    flex: 1;
  }

  .container-left {
    list-style: none;
    background-color: #fff;
    width: 230px;
    /*height: 900px;*/
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dedede;
  }

  .router-lists {
    text-decoration: none;
    height: 70px;
    width: 230px;
    line-height: 70px;
    text-align: center;
    /*display: flex;
    align-items: center;
    justify-content: center;*/
    position: relative;
    color: #000;
  }

  .icontColors {
    position: absolute;
    left: 50px;
  }

  .icon-user,
  .icon-lishijilu,
  .icon-xitongshezhi,
  .icon-quyuguanli {
    font-size: 20px;
  }

  .icon-shipinguanli {
    font-size: 24px;
  }

  .container-right {
    background-color: #f5f5f5;
    width: 100%;
    min-height: 100%;
    display: flex;
  }

  .router-link-active {
    background-color: #f0f5f9;
    border-left: 4px solid #19acf9;
  }

  .router-link-active>.icontColors {
    color: #19acf9;
  }
</style>