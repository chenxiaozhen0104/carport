<template>
  <div class="equi-container">
    <div class="equi-show" v-if="!mask">
      <div class="equi-header">
        <label>关键字:</label>
        <input type="text" class="keywords" placeholder="输入设备名称 / 序列号" v-model="searchKey" />
        <label>状态:</label>
        <!--<select class="status-select" v-model="eqstatus">
            <option value="">--请选择设备状态--</option>  
            <option :value="status" v-for="status in statusDate" v-html="status"></option>
          </select>-->
        <Select v-model="eqstatus">
          <Option v-for="status in statusDate" :value="status" v-html="status" :key="status"></Option>
        </Select>
        <Button :loading="loading" class="areaSearchBtn" @click="eqSearch">
          <span v-if="!loading">搜索</span>
          <span v-else>搜索中...</span>
        </Button>
        <input type="button" class="addEqui" value="新增设备" @click="showMask" />
        <p class="total"> {{' 共 '+totalNum +'&nbsp; 离线 '+ offlineNum +' &nbsp;在线 '+(totalNum - offlineNum)}}</p>
      </div>
      <div class="equi-content">
        <div class="equi-content-details">
          <div class="equi-left">
            <div v-for="area in areas" class="equi-left-details">
              <div class="left-details-text">
                <img src="../assets/zhezhi.png" class="zhezhi">
                <span v-html="area"></span>
                <div class="left-circle" v-html="getDeviceCountByArea(area)"></div>
              </div>
              <div class="left-details-content">
                <p>
                  <span>(01-16)</span>
                  <span class="deviceStatus" v-for="device in searchStatus(area)">
                    <Poptip trigger="hover" :title="'序列号: '+ device.SerialNumber" :content="'IP: '+device.Ip" >
                       <img :src="getImgUrl(device)" class="equi-img"  @click="getVideoArgument(device)" @dblclick="showEditor(device)"/>
                    </Poptip>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="equi-right">
            <video-iframe :serialNumber='videoNum' :channel='channelNum' wd="400" ht="280"></video-iframe>
            <div class="equi-scroll">
              <p v-for="(notice,i) in recodeMessage" v-if="recodeMessage.length>0">
                <Alert>{{'区域:'+ notice.Area + ',&nbsp;设备名称:'+ notice.DeviceName +'(' + notice.SerialNumber +')' +',&nbsp;事件名称:'
                  + notice.EventName +',&nbsp;时间:'}}{{notice.EventTime|datetime}}</Alert>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--添加设备-->
    <transition name="fade" mode="out-in">
      <div class="equi-hide" v-if="mask">
        <div class="equi-header">
          <div class="equi-title" @click="back">
            <i class="iconfont icon-xiangzuo"></i>
            <label class="return">返回</label>
          </div>
        </div>
        <div class="mask-content">
          <div class="mask-content-description">
            <div class="mask-details">
              <div class="mask-detailsLeft">
                <div class="mask-eqInfo">
                  <div class="mask-eqRow"><span class="eqRow-coltitle">设备信息</span></div>
                  <div class="mask-eqInfoList">
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">设备序列号</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.SerialNumber"></div>
                    </div>
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">设备名称</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Name"></div>
                    </div>
                  </div>
                  <div class="mask-eqInfoList">
                    <!--<div><span class="eqRow-coltitle"></span></div>-->
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">IP</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Ip"></div>
                    </div>
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">端口号</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Port"></div>
                    </div>
                  </div>
                  <div class="mask-eqInfoList">
                    <!--<div><span class="eqRow-coltitle"></span></div>-->
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">区域</div>
                      <div class="eqRow-col5">
                        <!--<select v-model="device.Area">
                      <option  disabled value="">--请选择区域--</option>  
                      <option v-for="item in areas" :value="item">{{item}}</option>
                    </select>-->
                        <Select v-model="device.Area">
                        <Option  v-for="item in areas" :value="item" v-html="item" :key="item"></Option>
                      </Select>
                      </div>
                    </div>
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">设备类别</div>
                      <div class="eqRow-col5">
                        <!--<select v-model="device.DeviceType">
                      <option  disabled value="">--请选择设备类别--</option>  
                      <option v-for="typeItem in eqtypes" :value="typeItem">{{typeItem}}</option>
                    </select>-->
                        <Select v-model="device.DeviceType">
                        <Option  v-for="typeItem in eqtypes" :value="typeItem" v-html="typeItem" :key="typeItem"></Option>
                      </Select>
                      </div>
                    </div>
                  </div>
                  <div class="mask-eqInfoList" v-if="isShowSuperPassword">
                    <!--<div><span class="eqRow-coltitle"></span></div>-->
                    <div class="mask-eqRow">
                      <div class="eqRow-col1"></div>
                      <div class="eqRow-col5"><button class="getEqCode" @click="modal1 = true">获取超级密码</button></div>
                    </div>
                  </div>
                  <Modal v-model="modal1" title="获取超级密码" @on-ok="ok" @on-cancel="cancel">
                    <p><span>手机号码:</span><input type="text" class="getsuper-password" maxlength="11" v-model="eqPhoneNum"></p>
                  </Modal>
                </div>
                <div class="mask-eqInfo">
                  <div class="mask-eqRow"><span class="eqRow-coltitle">相机信息</span></div>
                  <div class="mask-eqInfoList">
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">相机名称</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Cameras[0].CameraName"></div>
                    </div>
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">IP</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Cameras[0].Ip"></div>
                    </div>
                  </div>
                  <div class="mask-eqInfoList">
                    <!--<div><span class="eqRow-coltitle"></span></div>-->
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">端口号</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Cameras[0].Port"></div>
                    </div>
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">用户名</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Cameras[0].Name"></div>
                    </div>
                  </div>
                  <div class="mask-eqInfoList">
                    <!--<div><span class="eqRow-coltitle"></span></div>-->
                    <div class="mask-eqRow">
                      <div class="eqRow-col1">密码</div>
                      <div class="eqRow-col5"><input type="text" v-model="device.Cameras[0].Password"></div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="mask-detailsRight">
                <video-iframe :device='testPlay.device' :channel='testPlay.channel' wd="450" ht="400"></video-iframe>
              </div>
            </div>
            <!--通道部分-->
            <div class="mask-eqInfoList">
              <!--<div><span class="eqRow-coltitle"></span></div>-->
              <div class="mask-eqRow">
                <div class="eqRow-col1">添加通道</div>
                <div class="eqRow-col5"><i class="iconfont icon-tianjia" @click="device.Cameras[0].Channels.push({})"></i></div>
              </div>
            </div>
            <div class="mask-eqInfoList">
              <!--<div><span class="eqRow-coltitle"></span></div>-->
              <div class="mask-eqRow">
                <div class="eqRow-col1"></div>
                <div>
                  <ul class="eqRecode-list" v-if="device.Cameras[0].Channels.length>0">
                    <li class="eqRecode-infos eqRecode-bg">
                      <p class="eqRecode-gallery">通道名</p>
                      <p class="eqRecode-gallery">通道编号</p>
                      <p>操作</p>
                    </li>
                    <li class="eqRecode-infos" v-for="(item,i) in device.Cameras[0].Channels">
                      <p><input v-model="item.Name" class="eqRecode-infos-text" /></p>
                      <p><input v-model="item.Num" class="eqRecode-infos-text" /></p>
                      <p class="addeq-opertion">
                        <i class="iconfont icon-lajitong-copy" @click="deleterGallery(i)"></i>
                        <i class="iconfont icon-bofang" @click="getGalleryUrl(device,item.Num)"></i>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mask-eqInfoList">
              <div><span class="eqRow-coltitle"></span></div>
              <div class="mask-eqRow">
                <div class="eqRow-col1"></div>
                <div class="eqRow-col5">
                  <Button :loading="loading" class="maskEqBtn eqBtnSave" @click="eqSave">
                  <span v-if="!loading">提交</span>
                  <span v-else>提交中...</span>
              </Button>
                </div>
              </div>
            </div>
            <!--结束通道-->
          </div>
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
  import videoIframe from './iframe.vue'
  const imgUrlBlue = require('../assets/equiBlue.png')
  const imgUrlGray = require('../assets/equiGray.png')
  const imgUrlRed = require('../assets/equiRed.png')
  export default {
    components: { 'video-iframe': videoIframe },
    data() {
      return {
        showLoading: false,
        isShowSuperPassword: false,
        areas: JSON.parse(localStorage.getItem('Areas')),
        videoNum: '253110719',
        testPlay: {
          device: null,
          channel: 1
        },
        channelNum: '1',
        eqtypes: ['门磁', '继电器'],
        modal1: false,
        mask: false,
        addGalleryShow: false,
        btnCodeDisabled: false,
        loading: false,
        userId: localStorage.getItem('userId'),
        statusDate: ['离线', '开门', '关门'],
        searchKey: '',
        eqstatus: '',
        recodeMessage: this.$store.state.messageList,
        eqPhoneNum: '',
        deviceId: '',
        index: '',
        devices: this.$store.state.deviceList,
        device: {
          Cameras: [{
            CameraName: '',
            Ip: '',
            Port: '',
            Name: '',
            Password: '',
            Channels: []
          }]
        }
      }
    },
    computed: {
      totalNum() {
        return this.devices.length
      },
      offlineNum() {
        return this.devices.filter(m => m.Status !== '在线').length
      }
    },
    methods: {
      // 显示添加区域
      showMask() {
        this.mask = true
        this.isShowSuperPassword = false
      },
      // 关闭添加区域
      back() {
        this.mask = false
      },
      ok() {
        if (this.eqPhoneNum) {
          this.$Message.loading({ content: '数据提交中...' })
          axios.post(`api/Device?id=${this.deviceId}&phone=${this.eqPhoneNum}`).then(res => {
            console.log(res)
            if (res.data.result) {
              this.$Message.success(res.data.message)
            } else {
              this.$Message.error(res.data.message)
            }
            this.eqPhoneNum = ''
          })
        } else {
          this.$Message.warning('请输入手机号码!')
        }
        // this.$Message.info('点击了确定')
        // console.log(this.eqPhoneNum)
      },
      cancel() {
      },
      searchStatus(area) {
        var states = this.eqstatus
        var keyWord = this.searchKey
        var result = this.devices.filter(m => {
          return m.Area === area && (m.Name.indexOf(keyWord) >= 0 || m.SerialNumber.toString().indexOf(keyWord) >= 0) &&
            (states === '' || states === m.Status || (m.Status === '在线' && states === m.DoorStatus))
        })
        return result
      },
      // 删除通道
      deleterGallery(index) {
        this.$Modal.confirm({
          content: '<p>确定删除该通道</p>',
          onOk: () => {
            this.device.Cameras[0].Channels.splice(index, 1)
          }
        })
      },
      // 添加区域提交事件
      eqSave() {
        var saveSelf = this
        let device = this.device
        var methodName = 'post'
        if (this.device.Id) {
          methodName = 'put'
        }
        if (device.SerialNumber && device.Name && device.Port && device.Ip && device.Area && device.DeviceType) {
          saveSelf.loading = true
          axios[methodName]('api/Device', this.device).then((res) => {
            saveSelf.loading = false
            if (res.data.result) {
              device.Id = res.data.message
              saveSelf.$Message.success('添加成功')
              this.init()
            } else {
              saveSelf.$Message.error(res.data.message)
            }
          })
        } else {
          saveSelf.$Message.warning('请填写完成信息！')
        }
      },
      getVideoArgument(item) {
        this.videoNum = item.SerialNumber
        this.channelNum = item.Cameras[0].Channels[0].Num
      },
      // 初始化数据
      eqSearch() {
      },
      getGalleryUrl(device, channel) {
        this.testPlay.device = device
        this.testPlay.channel = channel
      },
      showEditor(item) {
        this.isShowSuperPassword = true
        this.mask = true
        this.device = item
        this.deviceId = item.Id
      },
      /**
       * @param {*} device 设备
       * @return {string}
       * */
      getImgUrl(device) {
        if (device.DoorStatus === '开门' && device.Status === '在线') {
          return imgUrlRed
        }
        if (device.DoorStatus === '关门' && device.Status === '在线') {
          return imgUrlBlue
        } else {
          return imgUrlGray
        }
      },
      // 过滤不同区域的总数量
      getDeviceCountByArea(area) {
        return this.devices.filter(m => m.Area === area).length
      },
      // 过滤区域
      getDeviceByArea(area) {
        return this.devices.filter(m => m.Area === area)
      },
      init() {
        this.$store.dispatch('fatchDevice')
      }
    },
    created() {
      this.init()
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

  .ivu-alert {
    padding: 8px 16px;
    font-size: 16px;
    line-height: 25px;
  }

  .equi-container {
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
    position: relative;
  }

  button {
    cursor: pointer;
  }

  .equi-header,
  .equi-footer {
    height: 90px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    padding: 0 30px;
  }

  .equi-header {
    border-bottom: 1px solid #c9c9c9;
  }

  .equi-footer {
    border-top: 1px solid #c9c9c9;
  }

  .equi-header label {
    margin-right: 10px;
  }

  .keywords {
    width: 220px;
    height: 45px;
    border: 1px solid #c9c9c9;
    padding-left: 15px;
    background-color: transparent;
    margin-right: 20px;
    font-size: 18px;
  }

  .status-select {
    width: 180px;
    height: 45px;
    border: 1px solid #c9c9c9;
    font-size: 18px;
    color: #a9a9a9;
    margin-right: 20px;
  }

  .equi-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 90px;
    cursor: pointer;
  }

  .search,
  .addEqui {
    height: 45px;
    border: none;
    color: #fff;
    font-size: 18px;
  }

  .search {
    width: 100px;
    background-color: #19acf9;
    margin-right: 20px;
  }


  .equi-container .areaSearchBtn {
    width: 100px;
    height: 45px;
    background-color: #19acf9;
    margin: 0 20px 0 0;
    padding: 0;
    border-radius: 0;
    color: #fff;
    font-size: 18px;
    border: none;
    margin-left: 20px;
  }

  .equi-container .areaSearchBtn:hover {
    background-color: #159de5;
    color: #fff;
  }

  .addEqui {
    width: 120px;
    background-color: #efa60b;
    margin-right: 30px;
  }

  .search:hover {
    cursor: pointer;
    background-color: #159de5;
  }

  .addEqui:hover {
    cursor: pointer;
    background-color: #df9a08;
  }

  .total {
    font-size: 24px;
    color: #333;
  }
  /*内容部分*/

  .equi-content {
    padding: 30px;
  }

  .equi-content-details {
    display: flex;
    justify-content: space-between;
  }

  .equi-left {
    width: 73%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    /*margin-right: 40px;*/
  }

  .equi-left-details {
    width: 585px;
    height: 133px;
    border: 1px solid #e5e5e5;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
  }

  .left-details-text {
    width: 72px;
    height: 133px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  .left-details-text span {
    font-size: 18px;
    color: #333;
    font-weight: bold;
  }

  .zhezhi {
    position: absolute;
    right: -10px;
    top: 0;
  }

  .left-circle {
    width: 28px;
    height: 28px;
    background-color: #19acf9;
    border-radius: 28px;
    color: #fff;
    text-align: center;
    line-height: 28px;
    margin-top: 16px;
    font-weight: bold;
  }

  .left-details-content {
    padding: 28px 10px;
    align-items: flex-start;
    line-height: 36px;
  }

  .left-details-content p {
    display: flex;
    align-items: center;
  }

  .deviceStatus {
    display: inline-flex;
    text-align: center;
    align-items: center;
    line-height: 0;
  }

  .equi-img {
    width: 18px;
    height: 18px;
    margin: 0 5px;
    cursor: pointer;
  }

  .equi-right {
    width: 400px;
    height: 300px;
    margin-bottom: 20px;
  }

  .right-img {
    width: 400px;
    height: 300px;
  }

  .equi-scroll {
    overflow: auto;
    width: 400px;
    height: 450px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    padding: 15px 15px 0;
    margin-top: 10px;
  }

  .scroll-methods {
    list-style: outside;
    padding: 20px;
  }

  .scroll-methods>li {
    line-height: 30px;
  }
  /*弹出页面*/

  .mask-content {
    width: 100%;
    height: 840px;
    padding: 30px;
    overflow-y: scroll;
    /*background-color:#fff;*/
  }

  .mask-content-description {
    background-color: #fff;
  }

  .mask-details {
    padding: 30px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-flow: row;
  }

  .icon-xiangzuo {
    font-size: 15px;
    color: #19acf9;
    margin-right: 10px;
  }

  .return {
    font-size: 18px;
    color: #19acf9;
    cursor: pointer;
  }
  /*弹框左边*/

  .mask-detailsLeft {
    /*width: 1050px;*/
    height: auto;
    margin-right: 15px;
  }

  .mask-eqInfo {
    margin-bottom: 30px;
  }

  .mask-eqInfo:last-child {
    margin-bottom: 0;
  }

  .mask-eqInfoList {
    display: flex;
    flex-direction: row;
  }

  .eqRow-coltitle {
    margin-right: 35px;
    display: inline-block;
    width: 100px;
    padding-left: 10px;
    border-left: 2px solid #1AB4E8;
  }

  .mask-eqRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
  }

  .eqRow-col1 {
    width: 80px;
    text-align: right;
    margin-right: 20px;
  }

  .eqRow-col5 input,
  .eqRecode-infos-text {
    height: 45px;
    /*outline: none;*/
    /*padding: 0 10px;*/
    padding-left: 10px;
  }

  .eqRow-col5 input {
    width: 270px;
    border: 1px solid #c9c9c9;
  }

  .eqRecode-infos-text {
    width: 275px;
  }

  .eqRow-col5 select {
    width: 270px;
    height: 40px;
    outline: none;
    padding: 0 10px;
  }

  .getEqCode {
    height: 40px;
    padding: 0 10px;
    border: none;
    color: #fff;
    background-color: #19ACF9;
    opacity: 1;
  }

  .getEqCode:disabled {
    opacity: 0.5;
  }

  .getsuper-password {
    height: 30px;
    width: 180px;
    outline: none;
    margin-left: 20px;
    padding: 0 10px;
    border: 1px solid #dedede;
  }

  .icon-tianjia {
    font-size: 30px;
    color: #19ACF9;
    cursor: pointer;
  }

  .eqRecode-list {
    list-style: none;
    border-top: 1px solid #c8c8c8;
    border-bottom: 1px solid #c8c8c8;
    background-color: #fff;
  }

  .eqRecode-infos {
    min-height: 45px;
    width: 670px;
    border: 1px solid #c8c8c8;
    border-top: none;
    display: flex;
  }

  .eqRecode-bg {
    background-color: #e4e3e3
  }

  .eqRecode-infos:hover {
    background-color: #e4e3e3;
  }

  .eqRecode-infos>p {
    border-right: 1px solid #c8c8c8;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .eqRecode-infos>p.eqRecode-gallery {
    width: 276px;
  }

  .eqRecode-infos>p:last-child {
    border-right: none;
    flex: 1;
    justify-content: center;
  }

  .eqRecode-infos:last-child {
    border-bottom: none;
  }

  .icon-bofang {
    color: green;
    font-size: 24px;
    cursor: pointer;
    margin-left: 20px;
  }

  .icon-lajitong-copy {
    color: palevioletred;
    cursor: pointer;
  }

  .maskEqBtn {
    width: 140px;
    height: 40px;
    outline: none;
    border: none;
    margin-right: 70px;
    color: #fff;
    padding: 0;
    font-size: 16px;
    border-radius: 0;
  }

  .eqBtnTest {
    background-color: #19ACF9;
  }

  .eqBtnSave {
    background-color: #EFA60A;
  }

  .eqBtnSave:hover {
    background-color: #EFA60A;
    color: #fff;
  }
  /*弹框右边*/

  .mask-detailsRight {
    /*flex: 1;*/
    height: auto;
    margin-left: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .mask-videoPlayer {
    height: 420px;
    width: 450px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .mask-videoHandle {
    display: flex;
    align-items: center;
    margin-top: 30px;
    flex-direction: column;
  }

  .videoPlay {
    height: 40px;
    width: 140px;
    outline: none;
    border: none;
    color: #fff;
    margin-top: 30px;
    background-color: #4CB050;
  }

  .mask-videoPlayer video {
    height: 200px;
    width: 220px;
    background-color: #dedede;
    margin-bottom: 15px;
  }

  .mask-videoPlayer video:nth-of-type(2n+1) {
    margin-right: 10px;
  }
  /*下拉框样式*/

  .equi-container .Select-Text {
    font-size: 18px;
    color: #a9a9a9;
  }


  .equi-container .ivu-select-single,
  .equi-container .ivu-select-selection {
    width: 270px;
    height: 45px;
    line-height: 45px;
    border-radius: 0;
    font-size: 18px;
  }

  .equi-container .ivu-select {
    width: 270px;
    height: 45px;
    line-height: 45px;
  }

  .equi-container .ivu-select-single .ivu-select-selection {
    height: 45px;
  }

  .equi-container .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .equi-container .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    font-size: 18px;
    line-height: 45px;
    color: #a9a9a9;
  }

  .equi-container .ivu-select-item {
    font-size: 18px;
    color: #a9a9a9;
  }

  @media only screen and (max-width: 1366px) {
    .eqRow-col5 input,
    .eqRow-col5 select,
    .equi-container .ivu-select-single,
    .equi-container .ivu-select-selection,
    .equi-container .eqRecode-infos-text,
    .equi-container .eqRecode-infos>p.eqRecode-gallery {
      width: 130px;
    }
    .eqRecode-infos {
      width: 395px;
    }
  }
</style>