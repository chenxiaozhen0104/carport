<template>
  <div class="sys-container">
    <div class="sys-top">
      <!--<div>
        <div class="setArea">
          <p class="setArea-text">设备连接记录</p>
          <div class="setArea-table">
            <div class="setArea-head">
              <p class="setArea-cell">名称</p>
              <p class="setArea-cell">类型</p>
              <p class="setArea-cell">时间</p>
            </div>
            <div class="setArea-body">
              <p class="setArea-cell">门禁1</p>
              <p class="setArea-cell">正常连接</p>
              <p class="setArea-cell">2017-07-03 12:45:32</p>
            </div>
          </div>
        </div>
      </div>-->
      <div class="setSystem">
        <p class="setArea-text">系统操作日志</p>
        <div class="setSystem-table">
          <div class="setSystem-head">
            <p class="setArea-cell">操作员</p>
            <p class="setArea-cell">操作类型</p>
            <p class="setArea-cell">发生时间</p>
          </div>
          <div class="setSystem-body" v-for="item in operaLog">
            <p class="setArea-cell">{{item.Name}}</p>
            <p class="setArea-cell">{{item.EventName}}</p>
            <p class="setArea-cell">{{item.CreateTime|datetime}}</p>
          </div>
        </div>
        <Spin fix v-if="showLoading">
          <Icon type="load-c" size='40' class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>
        <div class="sys-footer">
          <Page class="sys-pageList" :total="total" @on-change="change"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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

  .sys-container {
    background-color: #f5f5f5;
    padding: 30px 30px 0 30px;
    width: 100%;
  }

  .sys-top {
    display: flex;
    flex-direction: row;
  }

  .setArea,
  .setSystem {
    padding: 20px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    border-top: 4px solid #19acf9;
  }

  .setArea {
    width: 512px;
    margin-right: 40px;
  }

  .setSystem {
    flex: 1;
    padding-bottom: 10px;
  }

  .setArea-text {
    font-size: 22px;
    color: #333;
  }

  .setArea-table,
  .setSystem-table {
    border: 1px solid #c9c9c9;
    border-right: none;
    margin-top: 20px;
  }

  .setArea-head,
  .setArea-body,
  .setSystem-head,
  .setSystem-body {
    height: 60px;
    display: flex;
    flex-direction: row;
  }

  .setArea-head,
  .setSystem-head {
    background-color: #eeeded;
  }

  .setArea-cell {
    flex: 1;
    display: flex;
    border-right: 1px solid #c9c9c9;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .setArea-body:nth-child(odd) {
    background-color: #eeeded;
  }

  .cell-edit {
    display: flex;
    flex-direction: row;
    display: block;
    height: 25px;
    align-items: flex-end;
    margin-right: 45px;
  }

  .cell-edit:hover {
    cursor: pointer;
  }

  .icon-bianji,
  .cell-edit span {
    font-size: 16px;
    color: #19acf9;
  }

  .icon-bianji {
    margin-right: 8px;
  }

  .openCode {
    color: #333;
    font-size: 16px;
    margin-right: 20px;
  }

  .openCode-input {
    width: 330px;
    height: 45px;
    border: 1px solid #d2d2d2;
    padding-left: 25px;
  }

  .sys-footer {
    /*margin-top:10px;*/
    height: 60px;
    width: 100%;
    line-height: 60px;
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
</style>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        showLoading: false,
        operaLog: [],
        total: null,
        current: 1
      }
    },
    methods: {
      change(page) {
        this.showLoading = true
        this.current = page
        this.init()
      },
      init() {
        var selfs = this
        selfs.showLoading = false
        // 系統操作日志
        axios.get('api/System?pageIndex=' + selfs.current + '&pageSize=' + 10)
          .then(function (res) {
            selfs.total = res.data.OperaLog.Count
            selfs.operaLog = res.data.OperaLog.Data
          })
      }
    },
    created() {
      this.init()
    }
  }

</script>