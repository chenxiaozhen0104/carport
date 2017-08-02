<template>
  <div class="user">
    <div class="user-header">
      <div class="userHeader-left">
        <input class="userSearch" type="text" placeholder="请输入用户名搜索" v-model="userSearchText">
        <button class="userSearchBtn" @click="toLoading">搜索
          <!--<span v-if="!loading">搜索</span>
          <span v-else>搜索中...</span>-->
        </button>
        <button class="addUserBtn" @click="maskShow('0')">添加用户</button>
      </div>
      <div class="userHeader-right">
      </div>
    </div>
    <div class="user-content">
      <ul class="recode-list">
        <li class="recode-infos recode-bg">
          <p>序号</p>
          <p>用户名</p>
          <p>管辖区域</p>
          <p>创建时间</p>
          <p>操作</p>
        </li>
        <li class="recode-infos" v-bind:key="item.Id" v-for="(item,i) in userLists">
          <p>{{(current-1)*10+i+1}}</p>
          <p v-html="item.Name"></p>
          <p v-html="item.Areas?item.Areas.join(','):''"></p>
          <p>{{item.CreateTime|datetime}}</p>
          <p>
            <span class="userEditor" @click="maskShow(item)"><i class="iconfont icon-bianji"></i></span>
            <Tooltip content="密码重置" placement="top">
              <i class="iconfont icon-zhongzhimima" @click="passwordReset(item)"></i>
            </Tooltip>
            <i class="iconfont icon-lajitong-copy" @click="deleteUser(item)"></i></p>
        </li>
        <li class="recode-infos" v-if="!userLists.length">
          <p class="user-noResult">暂无数据</p>
        </li>
      </ul>
    </div>
    <transition name="slide-fade">
      <div class="recode-mask" v-if="userMask">
        <div class="recodeMask">
          <div class="recodeMask-title">
            <span class="recodeTitle-size">用户管理</span>
            <i class="iconfont icon-wechaticon28" @click="maskClose"></i>
          </div>
          <ul class="userAdd-editor">
            <li class="editor-row">
              <p class="editor-title">用户名 :</p>
              <p class="editor-text">
                <input class="editor-inputs" type="text" v-model="userName">
              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title">初始密码 :</p>
              <p class="editor-text">
                <input class="editor-inputs" type="text" value="888888" readonly="readonly">
                <!--<input type="button" value="生成" class="editor-createPass" @click="createPassword">-->
              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title">手机号码 :</p>
              <p class="editor-text">
                <input class="editor-inputs" type="text" v-model="userPhone" maxlength="11" @keyup="regPhonesNum">
                <span v-if="showPhoneIcon">
                  <Icon type="ios-close-outline" class="PhoneIcon" size="28" color="red" v-if="!regPhone"></Icon>
                  <Icon type="ios-checkmark-outline" class="PhoneIcon" size="28" color="green" v-else></Icon>
              </span>

              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title">管理区域 :</p>
              <p class="editor-text">
                <Checkbox-group v-model="areas">
                  <Checkbox label="北京"> 北京</Checkbox>
                  <Checkbox label="上海"> 上海</Checkbox>
                  <Checkbox label="重庆"> 重庆</Checkbox>
                  <Checkbox label="南京"> 南京</Checkbox>
                  <Checkbox label="广州"> 广州</Checkbox>
                  <Checkbox label="杭州"> 杭州</Checkbox>
                </Checkbox-group>
              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title">权限管理 :</p>
              <p class="editor-text">
                <Checkbox-group v-model="limits">
                  <Checkbox label="1"> 设备管理 </Checkbox>
                  <Checkbox label="2"> 用户管理 </Checkbox>
                  <Checkbox label="4"> 系统管理 </Checkbox>
                  <Checkbox label="8"> 记录查看 </Checkbox>
                  <Checkbox label="16"> 区域管理 </Checkbox>
                </Checkbox-group>
              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title"></p>
              <p class="editor-text">
                <input type="button" value="保存" class="editor-saveBtn" @click="addUser">
              </p>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <Spin fix v-if="showLoading">
      <Icon type="load-c" size='40' class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <div class="footerPage">
      <Page class="pageList" :total="total" @on-change="change"></Page>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'user',
    data() {
      return {
        showLoading: false,
        userMask: false,
        // loading: false,
        showPhoneIcon: false,
        regPhone: null,
        addUserMark: '',
        userSearchText: '',
        userId: '',
        userName: '',
        userPhone: '',
        areas: [],
        limits: [],
        current: 1,
        total: 100,
        userLists: []
      }
    },
    // computed: {
    //   success() {
    //     return /^1[34578]\d{9}$/.test(this.userPhone)
    //   }
    // },
    methods: {
      // 显示蒙版事件
      maskShow(item) {
        this.userMask = true
        if (item !== '0') {
          this.userId = item.Id
          this.addUserMark = 1
          this.userName = item.Name
          this.userPhone = item.Phone
          this.limits = []
          this.areas = []
          this.areas = item.Areas ? item.Areas : []
          for (var i = 0; i < 5; i++) {
            if ((item.Role & Math.pow(2, i)) > 0) {
              this.limits.push(Math.pow(2, i) + '')
            }
          }
        } else {
          this.addUserMark = ''
          this.userName = ''
          this.userPhone = ''
          this.areas = []
          this.limits = []
        }
      },
      // 关闭蒙版事件
      maskClose() {
        this.userMask = false
      },
      // 删除用户事件
      deleteUser(item) {
        var delSelf = this
        delSelf.$Modal.confirm({
          content: '<p>删除该用户，信息将无法修复！</p>',
          onOk: () => {
            axios.delete('/api/User?id=' + item.Id)
              .then(function (res) {
                delSelf.$Message.success(res.data.message)
                delSelf.init()
              })
          }
        })
      },
      // 生成密码事件
      createPassword() {
        var Num = ''
        for (var i = 0; i < 8; i++) {
          Num += Math.floor(Math.random() * 10)
        }
        this.userPassword = Num
      },
      // 添加或编辑用户事件
      addUser() {
        var _this = this
        var roleLists = 0
        _this.limits.forEach(function (i) {
          roleLists += parseInt(i)
        })
        if (_this.userName && _this.userPhone) {
          if (_this.addUserMark) {
            _this.userMask = false
            axios.put('/api/User', {
              Id: _this.userId,
              Name: _this.userName,
              Phone: _this.userPhone,
              Role: roleLists,
              Areas: _this.areas
            }).then(function (res) {
              _this.$Message.success(res.data.message)
              _this.init()
            }).catch(function (err) {
              _this.$Message.error(err.data.message)
            })
          } else {
            _this.userMask = false
            axios.post('/api/User',
              {
                Name: _this.userName,
                Phone: _this.userPhone,
                Role: roleLists,
                Areas: _this.areas
              }).then(function (res) {
                _this.$Message.success(res.data.message)
                _this.init()
              }).catch(function (err) {
                _this.$Message.error(err.data.message)
              })
          }
        } else {
          _this.$Message.warning('用户名、密码、手机号码必填！')
        }
      },
      // 重置密码事件
      passwordReset(item) {
        var rstSelf = this
        rstSelf.$Modal.confirm({
          content: '<p>重置密码需要牢牢记住吆！</p>',
          onOk: () => {
            axios.post('/api/User?id=' + item.Id + '&OperateType=' + 0
            ).then(function (res) {
              var arrStr = res.data.message.split('!')
              setTimeout(function () {
                rstSelf.$Modal.success({
                  title: arrStr[0],
                  content: arrStr[1]
                })
              }, 300)
            }).catch(function (err) {
              rstSelf.$Message.error(err.data.message)
            })
          }
        })
      },
      // 数据初始化事件
      init() {
        var selfs = this
        // selfs.loading = false
        selfs.showLoading = false
        axios.get('/api/User?search=' + selfs.userSearchText + '&pageIndex=' + selfs.current + '&pageSize=' + 10)
          .then(function (res) {
            console.log(res)
            selfs.total = res.data.Count
            selfs.userLists = res.data.Data
          })
      },
      // 搜索事件
      toLoading() {
        this.showLoading = true
        // this.loading = true
        this.userLists = []
        this.current = 1
        this.init()
      },
      // 页码切换事件
      change(page) {
        this.showLoading = true
        this.current = page
        this.init()
      },
      regPhonesNum() {
        this.showPhoneIcon = true
        if (/^1[34578]\d{9}$/.test(this.userPhone)) {
          this.regPhone = true
        } else {
          this.regPhone = false
        }
      }
    },
    created() {
      this.init()
    }
  }

</script>

<style>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
  
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .user {
    width: 100%;
    background-color: #fff;
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }
  
  .user-header {
    height: 90px;
    width: 100%;
    padding: 15px 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  input {
    outline: none;
    border: 1px solid #c9c9c9;
  }
  
  .ivu-checkbox-wrapper {
    margin-right: 15px;
  }
  
  .userSearch {
    height: 45px;
    width: 285px;
    font-size: 18px;
    padding: 0px 15px;
  }
  
  button {
    height: 45px;
    line-height: 45px;
    outline: none;
    border: none;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  
  .userSearchBtn {
    width: 100px;
    background-color: #19acf9;
    margin: 0 15px 0 15px;
    padding: 0;
    border-radius: 0;
    color: #fff;
    font-size: 16px;
    border: none;
  }
  
  .userSearchBtn:hover {
    background-color: #159de5;
    color: #fff;
  }
  
  .addUserBtn {
    width: 120px;
    background-color: #efa60b;
  }
  
  .userDeleteAll {
    width: 100px;
    background-color: #1ab4e8;
    margin-left: 60px;
  }
  
  .user-content {
    height: 704px;
    padding: 30px 30px 50px 30px;
    width: 100%;
    background-color: #f5f5f5;
    border-top: 1px solid #c9c9c9;
    border-bottom: 1px solid #c9c9c9;
  }
  /*用户列表*/
  
  .recode-list {
    list-style: none;
    border-top: 1px solid #c8c8c8;
    border-bottom: 1px solid #c8c8c8;
    background-color: #fff;
  }
  
  .recode-infos {
    min-height: 55px;
    width: 100%;
    border: 1px solid #c8c8c8;
    border-top: none;
    display: flex;
  }
  
  .recode-bg {
    background-color: #e4e3e3
  }
  
  .recode-infos:hover {
    background-color: #e4e3e3;
  }
  
  .recode-infos>p {
    flex: 1;
    min-height: 100%;
    border-right: 1px solid #c8c8c8;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .recode-infos>p.user-noResult {
    display: flex;
    justify-content: center;
    color:#aaa;
  }
  
  .recode-infos>p:last-child {
    border-right: none;
  }
  
  .recode-infos:last-child {
    border-bottom: none;
  }
  
  .icon-bianji {
    color: #1ab4e8;
  }
  
  .icon-lajitong-copy {
    color: palevioletred;
    cursor: pointer;
  }
  
  .icon-zhongzhimima {
    color: #efa60b;
    cursor: pointer;
    font-size: 28px;
    margin: 0 20px;
  }
  
  .userEditor {
    cursor: pointer;
  }
  
  .PhoneIcon {
    margin-left: 20px;
  }
  
  .userEditor>a {
    text-decoration: none;
    color: #1ab4e8;
    margin-left: 10px;
  }
  /*蒙版*/
  
  .recode-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(153, 153, 153, 0.4);
  }
  
  .recodeMask {
    height: auto;
    width: 1000px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    box-shadow: 1px 1px 40px 1px #999;
  }
  
  .recodeMask-title {
    width: 100%;
    height: 60px;
    background-color: #19acf9;
    text-align: center;
    line-height: 60px;
    position: relative;
  }
  
  .recodeTitle-size {
    font-size: 20px;
    color: #fff;
  }
  
  .icon-wechaticon28 {
    font-size: 34px;
    position: absolute;
    right: 35px;
    color: #fff;
  }
  
  .userAdd-editor {
    width: 100%;
    padding: 40px 50px;
    display: flex;
    flex-direction: column;
  }
  
  .editor-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 25px;
    align-items: center;
  }
  
  .editor-title {
    width: 100px;
    text-align: right;
  }
  
  .editor-text {
    flex: 1;
    padding-left: 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .editor-inputs {
    width: 275px;
    height: 40px;
    padding: 0 10px;
  }
  
  .editor-createPass {
    width: 80px;
    height: 40px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: #1ab4e8;
    color: white;
    margin-left: 15px;
  }
  
  .editor-createPass:active {
    background-color: #4cb050;
  }
  
  .editor-text>label {
    margin-right: 20px;
    /*margin-bottom: 15px;*/
  }
  
  .editor-saveBtn {
    margin-top: 50px;
    width: 150px;
    height: 40px;
    color: #fff;
    border: none;
    background-color: #efa60b;
    font-size: 16px;
  }
  
  .footerPage {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 90px;
    width: 100%;
    background-color: #fff;
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
  
  .pageList {
    margin-right: 30px;
  }
</style>