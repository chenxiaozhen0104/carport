<template>
  <div class="area">
    <div class="area-header">
      <div class="areaHeader-left">
        <input class="areaSearch" type="text" placeholder="请输入区域名称搜索" v-model="areaSearchText">
        <button class="areaSearchBtn" @click="areaSearch">搜索
          <!--<span v-if="!loading">搜索</span>
          <span v-else>搜索中...</span>-->
        </button>
        <button class="addUserBtn" @click="maskShow('0')">添加区域</button>
      </div>
      <div class="areaHeader-right">
      </div>
    </div>
    <div class="area-content">
      <ul class="recode-list">
        <li class="recode-infos recode-bg">
          <p>序号</p>
          <p>区域名称</p>
          <p>设备数量</p>
          <p>创建时间</p>
          <p>操作</p>
        </li>
        <li class="recode-infos" v-bind:key="item.Id" v-for="(item,i) in areaLists">
          <p>{{i+1}}</p>
          <p v-html="item.Name"></p>
          <p v-html="item.Num"></p>
          <p>{{item.CreateTime|datetime}}</p>
          <p>
            <span class="area-areaEditor" @click="maskShow(item)"><i class="iconfont icon-bianji"></i></span>
            <i class="iconfont icon-lajitong-copy" @click="deleteUser(item)"></i>
          </p>
        </li>
        <li class="recode-infos" v-if="!areaLists.length">
          <p class="noneSearchContent">暂无数据</p>
        </li>
      </ul>
    </div>
    <transition name="slide-fade">
      <div class="recode-mask" v-if="areaMask">
        <div class="areaMask">
          <div class="recodeMask-title">
            <span class="recodeTitle-size">区域管理</span>
            <i class="iconfont icon-wechaticon28" @click="maskClose"></i>
          </div>
          <ul class="areaAdd-editor">
            <li class="editor-row">
              <p class="editor-title">区域名称 :</p>
              <p class="editor-text">
                <input class="editor-inputs" type="text" v-model="areaName">
              </p>
            </li>
            <li class="editor-row">
              <p class="editor-title"></p>
              <p class="editor-text">
                <input type="button" value="保存" class="editor-saveBtn" @click="addArea">
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
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        showLoading: false,
        areaMask: false,
        // loading: false,
        addUserMark: '',
        areaSearchText: '',
        areaId: '',
        areaName: '',
        areaLists: []
      }
    },
    methods: {
      // 显示蒙版事件
      maskShow(item) {
        this.areaMask = true
        if (item !== '0') {
          this.addUserMark = 1
          this.areaName = item.Name
          this.areaId = item.Id
        } else {
          this.addUserMark = ''
          this.areaName = ''
          this.areaId = ''
        }
      },
      // 关闭蒙版事件
      maskClose() {
        this.areaMask = false
      },
      // 删除用户事件
      deleteUser(item) {
        var delSelf = this
        delSelf.$Modal.confirm({
          content: '<p>删除该区域，信息将无法修复！</p>',
          onOk: () => {
            axios.delete('/api/Areas?id=' + item.Id)
              .then(function (res) {
                delSelf.$Message.success(res.data.message)
                delSelf.init()
              })
          }
        })
      },
      // 添加或编辑用户事件
      addArea() {
        var _this = this
        _this.areaMask = false
        if (_this.addUserMark) {
          axios.put('/api/Areas', {
            Name: _this.areaName,
            Id: _this.areaId
          }).then(function (res) {
            _this.$Message.success(res.data.message)
            _this.init()
          }).catch(function (err) {
            _this.$Message.error(err.data.message)
          })
        } else {
          axios.post('/api/Areas', {
            Name: _this.areaName
          }).then(function (res) {
            _this.$Message.success(res.data.message)
            _this.init()
          }).catch(function (err) {
            _this.$Message.warning(err.data.message)
          })
        }
      },
      // 数据初始化事件
      init() {
        var selfs = this
        // selfs.loading = false
        selfs.showLoading = false
        axios.get('api/Areas?name=' + selfs.areaSearchText).then(function (res) {
          selfs.areaLists = res.data
        })
      },
      // 搜索事件
      areaSearch() {
        this.showLoading = true
        // this.loading = true
        this.areaLists = []
        this.init()
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
  
  .area {
    width: 100%;
    background-color: #f5f5f5;
    height: 100%;
    position: relative;
  }
  
  .area-header {
    height: 90px;
    width: 100%;
    padding: 15px 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  
   ::-webkit-input-placeholder {
    font-size: 18px;
    color: #a9a9a9;
  }
  
   ::-moz-placeholder {
    font-size: 18px;
    color: #a9a9a9;
  }
  
   ::-ms-input-placeholder {
    font-size: 18px;
    color: #a9a9a9;
  }
  
  .areaSearch {
    height: 45px;
    width: 285px;
    font-size: 14px;
    line-height: 45px;
    padding-left: 10px;
    outline: none;
    border: 1px solid #c9c9c9;
    background-color: transparent;
    margin-right: 15px;
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
  
  .areaSearchBtn {
    width: 100px;
    background-color: #19acf9;
    /*margin: 0 30px 0 20px;*/
    margin-right: 15px;
    padding: 0;
    border-radius: 0;
    color: #fff;
    font-size: 16px;
    border: none;
  }
  
  .areaSearchBtn:hover {
    background-color: #159de5;
    color: #fff;
  }
  
  .addUserBtn {
    width: 120px;
    background-color: #efa60b;
  }
  
  .addUserBtn:hover {
    background-color: #df9a08;
  }
  
  .areaDeleteAll {
    width: 100px;
    background-color: #1ab4e8;
    margin-left: 60px;
  }
  
  .area-content {
    /*height: 100%;*/
    padding: 30px 30px 50px 30px;
    width: 100%;
    height: 700px;
    background-color: #f5f5f5;
    border-top: 1px solid #c9c9c9;
    /*border-bottom: 1px solid #c9c9c9;*/
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
  
  .area-areaEditor {
    margin-right: 20px;
    cursor: pointer;
  }
  
  .recode-infos>p.noneSearchContent {
    width: 100%;
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
  
  .listCheckbox {
    position: absolute;
    left: 50px;
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
  
  .areaEditor {
    cursor: pointer;
  }
  
  .PhoneIcon {
    margin-left: 20px;
  }
  
  .areaEditor>a {
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
  
  .areaMask {
    height: 338px;
    width: 673px;
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
  
  .areaAdd-editor {
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
  
  .pageList {
    margin-right: 30px;
  }
</style>