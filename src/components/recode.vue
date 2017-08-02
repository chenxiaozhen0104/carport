<template>
  <div class="recode">
    <div class="recodeCont">
      <ul class="recode-list">
        <li class="recode-info recode-bg">
          <p>序号</p>
          <p>设备名称</p>
          <p>区域</p>
          <p>申请时间</p>
          <p>类型</p>
          <p>操作</p>
        </li>
        <li v-if='!recodeList.length' class="noData">暂无数据</li>
        <li class="recode-info" v-for="(item,i) in recodeList" v-else>
          <p>{{(current-1)*10+i+1}}</p>
          <p v-html="item.DoorName"></p>
          <p v-html="item.Area"></p>
          <p>{{item.CreateTime|datetime}}</p>
          <p v-html="item.OperaType"></p>
          <p><span class="operate" @click="maskShow(item)">查看</span></p>
        </li>
      </ul>
    </div>
    <transition name="slide-fade">
      <div class="recode-mask" v-if="showMask">
        <div class="recodeMask">
          <div class="recodeMask-title">
            <span class="recodeTitle-size">{{recodeMaskTitle}}</span>
            <i class="iconfont icon-wechaticon28" @click="maskClose"></i>
          </div>
          <div class="recodeMask-cont">
            <div class="recode-video">
              <video-iframe :serialNumber='num' :channel="channel1" wd="410" ht="250"></video-iframe>
              <video-iframe :serialNumber='num' :channel="channel2" wd="400" ht="250"></video-iframe>
              <!--<iframe width="410" height="250" frameborder="no" scrolling="no" :src="videoUrl1"></iframe>
            <iframe width="410" height="250" frameborder="no" scrolling="no" :src="videoUrl2"></iframe>-->
            </div>
            <div class="recode-note">
              <span class="recodeNote-title">备注: </span>
              <textarea placeholder="请输入不超过200字的备注" v-model="recodeDescrible"></textarea>
            </div>
            <div class="recode-btn">
              <button class="recodeBtn-pass" @click="recodeBtns('1')">开门</button>
              <button @click="recodeBtns()">不通过</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--<div class="footerPage">
      <Page class="pageList" :total="totals" @on-change="change"></Page>
    </div>-->
  </div>
</template>

<script>
  import axios from 'axios'
  import videoIframe from './iframe.vue'
  export default {
    components: { 'video-iframe': videoIframe },
    data() {
      return {
        num: '253110719',
        channel1: '1',
        channel2: '1',
        showMask: false,
        totals: 100,
        current: 1,
        recodeList: [],
        devicesLists: this.$store.state.deviceList,
        videoData: null,
        videoUrl1: '',
        videoUrl2: '',
        recodeMaskTitle: '',
        recodeDescrible: '',
        serialNumber: '',
        recodeId: ''
      }
    },
    methods: {
      // 获取申请记录列表事
      init() {
        var t = this
        axios.get('/api/InOut')
          .then((res) => {
            // t.totals = res.data.data.length
            t.recodeList = res.data
          })
      },
      // 显示记录详情蒙版
      maskShow(item) {
        this.videoData = this.devicesLists.filter(res => {
          return res.SerialNumber === item.SerialNumber
        })[0].Cameras[0].Channels
        this.channel1 = this.videoData[0].Num
        this.channel2 = this.videoData[1] ? this.videoData[1].Num : '1'
        this.showMask = true
        this.recodeMaskTitle = item.DoorName + ' ——  (' + item.Area + ')'
        this.serialNumber = item.SerialNumber
        this.num = item.SerialNumber
        this.recodeId = item.Id
      },
      // 关闭记录详情蒙版
      maskClose() {
        this.showMask = false
        this.recodeDescrible = ''
        this.init()
      },
      // 开门、关闭事件
      recodeBtns(type) {
        if (type === '1') {
          this.isOpen('1')
        } else {
          if (this.recodeDescrible) {
            this.isOpen('3')
          } else {
            this.$Message.warning('请填写备注信息!')
          }
        }
      },
      getDevice() {
        this.$store.dispatch('fatchDevice')
      },
      //  开门，关闭ajax请求
      isOpen(Num) {
        var data = {
          Id: this.recodeId,
          SerialNumber: this.serialNumber,
          Remark: this.recodeDescrible,
          OperaType: Num
        }
        this.$store.dispatch('sendWarningMessage', JSON.stringify(data))
        this.$Message.success('命令已发送！')
      }
      // 页码切换事件
      // change(page) {
      //   this.current = page
      //   this.init()
      // }
    },
    created() {
      this.init()
      this.getDevice()
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
  .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
  
  {
    transform: translateX(10px);
    opacity: 0;
  }
  
  .recode {
    height: 100%;
    width: 100%;
    height: 860px;
    position: relative;
  }
  
  .recodeCont {
    width: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .recode-list {
    background-color: #fff;
    list-style: none;
    border-top: 1px solid #c8c8c8;
    border-bottom: 1px solid #c8c8c8;
  }
  
  .recode-info {
    min-height: 60px;
    width: 100%;
    border: 1px solid #c8c8c8;
    border-top: none;
    display: flex;
  }
  .noData{
    width:100%;
    min-height:60px;
    text-align:center;
    line-height:60px;
    color:#aaa;
    border-right:1px solid #d2d2d2;
    border-left:1px solid #d2d2d2;
  }
  .recode-bg {
    background-color: #e4e3e3
  }
  
  .recode-info:hover {
    background-color: #e4e3e3;
  }
  
  .recode-info>p {
    flex: 1;
    min-height: 100%;
    border-right: 1px solid #c8c8c8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .operate {
    text-decoration: none;
    color: #1ab4e8;
    cursor: pointer;
  }
  
  .recode-info>p:last-child {
    border-right: none;
  }
  
  .recode-info:last-child {
    border-bottom: none;
  }
  /*申请记录蒙版*/
  
  .recode-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(153, 153, 153, 0.4);
    z-index: 10;
  }
  
  .recodeMask {
    height: 630px;
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
  
  .recodeMask-cont {
    width: 100%;
    height: auto;
    padding: 30px 55px;
  }
  
  .recode-video {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .recode-video>video {
    height: 220px;
    width: 420px;
    background-color: #c8c8c8;
  }
  
  .recode-note {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
  }
  
  .recodeNote-title {
    width: 60px;
    font-weight: bold;
  }
  
  textarea {
    resize: none;
    height: 150px;
    width: 100%;
    border: 1px solid #c8c8c8;
    padding: 10px 15px;
    font-size: 14px;
    outline: none;
  }
  
  .recode-btn {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
  
  .recode-btn>button {
    outline: none;
    width: 140px;
    height: 40px;
    border: none;
    margin: 0 80px;
    font-size: 18px;
    background-color: #ff8080;
    color: #fff;
  }
  
  .recode-btn>button.recodeBtn-pass {
    background-color: #19acf9;
  }
  /*.footerPage {
    border-top: 1px solid #c9c9c9;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 90px;
    width: 100%;
    background-color: #fff;
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }*/
</style>