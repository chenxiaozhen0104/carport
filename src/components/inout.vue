<template>
  <div class="Inout-container">
    <div class="Inout-header">
      <Input size="large" placeholder="操作人/设备名称" v-model="operateName" style="width: 185px"></Input>
      <!--<input type="text" class="Inout-name" placeholder="输入操作人/设备名称" v-model="operateName" />-->
      <Date-picker type="date" placeholder="选择开始时间" style="width: 200px" v-model="beginTime" class="time-input"></Date-picker>
      <Date-picker type="date" placeholder="选择结束时间" style="width: 200px" v-model="endTime" class="time-input"></Date-picker>
      <p class="inoutSelect-text">区域：</p>
      <Select v-model="areaName">
        <Option v-for="area in areas" :value="area.name" :key="area.name">{{ area.name }}</Option>
      </Select>
      <p class="inoutSelect-text leftSpace">类型：</p>
      <Select v-model="categoryName">
        <Option v-for="category in cetegories" :value="category.name" :key="category.name">{{ category.name }}</Option>
      </Select>
      <button class="Inout-search leftSpace" @click="search">搜索</button>
    </div>
    <div class="Inout-content">
      <div class="Inout-table">
        <div class="table-head">
          <p class="Inout-cell right">序号</p>
          <p class="Inout-cell right">名称</p>
          <p class="Inout-cell right">区域</p>
          <p class="Inout-cell right">操作类型</p>
          <p class="Inout-cell right">时间</p>
          <p class="Inout-cell right">操作人</p>
          <p class="Inout-cell right">备注</p>
        </div>
        <div class="table-body" v-if="!inOutList.length">
          <p class="none">暂无数据</p>
        </div>
        <div class="table-body" v-for="(item,i) in inOutList" v-else>
          <p class="Inout-cell right">{{(current-1)*10+i+1}}</p>
          <p class="Inout-cell right">{{item.DoorName}}</p>
          <p class="Inout-cell right">{{item.Area}}</p>
          <p class="Inout-cell right">{{item.OperaType}}</p>
          <p class="Inout-cell right">{{item.CreateTime|datetime}}</p>
          <p class="Inout-cell right">{{item.OperaUser}}</p>
          <p class="Inout-cell right">{{item.Remark}}</p>
        </div>
      </div>
    </div>
    <Spin fix v-if="showLoading">
      <Icon type="load-c" size='40' class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <div class="Inout-footer">
      <Page class="Inout-pageList" :total="total" @on-change="change"></Page>
    </div>
  </div>
</template>

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

  .Inout-container {
    width: 100%;
    background-color: #f5f5f5;
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .Inout-header,
  .Inout-footer {
    height: 90px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    padding: 0 30px;
  }

  .Inout-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .Inout-header {
    border-bottom: 1px solid #c9c9c9;
  }

  .Inout-name {
    width: 180px;
    padding: 5px;
    height: 45px;
    margin-right: 15px;
    border: 1px solid #c9c9c9;
    /*padding-left: 18px;*/
    font-size: 18px;
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

  .beginTime,
  .endTime {
    font-size: 18px;
    color: #a9a9a9;
    margin-right: 10px;
  }

  .Inout-Time,
  .Inout-area,
  .Inout-category {
    width: 150px;
    height: 45px;
    border: 1px solid #c9c9c9;
    /*padding-left: 18px;*/
    color: #a9a9a9;
    font-size: 18px;
    margin-right: 20px;
  }
  /*设置选择日期的样式*/

   ::-webkit-inner-spin-button {
    visibility: hidden;
  }

   ::-webkit-calendar-picker-indicator {
    margin-right: 10px;
  }

  .Inout-search {
    width: 100px;
    height: 45px;
    background-color: #19acf9;
    border: none;
    color: #fff;
    font-size: 18px;
    /*margin-left:15px;*/
  }

  .Inout-search:hover {
    background-color: #159de5;
    cursor: pointer;
  }

  .Inout-footer {
    border-top: 1px solid #c9c9c9;
    justify-content: flex-end;
  }
  /*内容部分*/

  .Inout-content {
    width: 100%;
    padding: 30px;
  }

  .Inout-table {
    width: 100%;
    border: 1px solid #d2d2d2;
    background-color: #fff;
    border-bottom: none;
    border-right: none;
  }

  .table-head,
  .table-body {
    width: 100%;
    /*height: 50px;*/
    min-height: 55px;
    display: flex;
    flex-direction: row;
  }

  .table-head {
    background-color: #eeeded;
  }

  .Inout-cell {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #d2d2d2;
  }

  .right {
    border-right: 1px solid #d2d2d2;
  }

  .none {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #d2d2d2;
    border-bottom: 1px solid #d2d2d2;
    color: #aaa;
  }
  /*选择日期样式*/

  .Inout-container .ivu-input {
    width: 170px;
    height: 45px;
    line-height: 45px;
    border: 1px solid #d2d2d2;
    cursor: pointer;
    background: transparent;
    border-radius: 0;
    font-size: 18px;
    color: #a9a9a9;
  }

  .Inout-container .ivu-input-icon {
    line-height: 45px;
    right: 30px;
  }

  .time-input {
    margin-right: -15px;
  }
  /*下拉框样式*/

  .inoutSelect-text {
    font-size: 18px;
    color: #a9a9a9;
    /*margin-left:15px;*/
  }


  .Inout-container .ivu-select-single .ivu-select-selection {
    height: 45px;
  }

  .Inout-container .ivu-select-single,
  .Inout-container .ivu-select-selection {
    width: 270px;
    height: 45px;
    line-height: 45px;
    border-radius: 0;
    font-size: 18px;
  }

  .Inout-container .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .Inout-container .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    font-size: 18px;
    line-height: 45px;
    color: #a9a9a9;
  }

  .Inout-container .ivu-select-item {
    font-size: 18px;
    color: #a9a9a9;
  }

  option {
    min-height: none;
    font-size: 18px;
  }

  .leftSpace {
    margin-left: 15px;
  }
</style>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        showLoading: false,
        inOutList: [],
        current: 1,
        total: 100,
        operateName: '',
        beginTime: '',
        endTime: '',
        areas: [
          { value: 'hangzhou', name: '杭州' },
          { value: 'ningbo', name: '宁波' },
          { value: 'wenzhou', name: '温州' },
          { value: 'jiaxing', name: '嘉兴' },
          { value: 'huzhou', name: '湖州' },
          { value: 'shaoxing', name: '绍兴' },
          { value: 'quzhou', name: '衢州' },
          { value: 'zhoushan', name: '舟山' },
          { value: 'taizhou', name: '台州' },
          { value: 'jinhua', name: '金华' }
        ],
        cetegories: [
          { value: 'open', name: '开门' },
          { value: 'close', name: '关门' },
          { value: 'applyOpen', name: '进门申请' },
          { value: 'errOpen', name: '强行闯入报警' },
          { value: 'superOpen', name: '超级密码开门' }
        ],
        areaName: '',
        categoryName: ''
      }
    },
    methods: {
      changePage(cur) {
        this.curpage = cur
      },
      search() {
        this.showLoading = true
        this.inOutList = []
        this.current = 1
        this.init()
      },
      init() {
        var that = this
        that.showLoading = false
        axios.get('/api/InOut?pageIndex=' + that.current + '&pageSize=' + 10 + '&name=' + that.operateName + '&beginTime=' + that.beginTime + '&endTime=' + that.endTime + '&area=' + that.areaName + '&operaType=' + that.categoryName)
          .then(function (res) {
            console.log(res)
            that.total = res.data.Count
            that.inOutList = res.data.Data
          })
          .catch(function (err) {
            that.$Message.error(err)
          })
      },
      // 页码切换
      change(page) {
        this.showLoading = true
        this.current = page
        this.init()
      }
    },
    created() {
      this.init()
    }
  }

</script>