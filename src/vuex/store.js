import Vue from 'vue'
import Vuex from 'vuex'
import config from 'config'
import axios from 'axios'
Vue.use(Vuex)
let warningWebsocket
let deviceWebsocket
let messageWebsocket
const store = new Vuex.Store({
  state: {
    deviceList: [],
    messageList: [],
    warningMessage: { id: 0, content: {} }
  },
  mutations: {
    newDeviceList(state, devicese) {
      state.deviceList = devicese
    },
    newMessageList(state, recodeMessage) {
      state.messageList = recodeMessage
    },
    setWarningMessage(state, msg) {
      state.warningMessage = msg
    }
  },
  actions: {
    initDevice({ commit, dispatch, state }) {
      if (state.deviceList.length === 0) {
        dispatch('fatchDevice')
      }
    },
    fatchDevice({ commit, dispatch, state }) {
      axios.get('api/Device').then((res) => {
        let list = state.deviceList
        list.length = 0
        res.data.forEach(m => list.push(m))
        commit('newDeviceList', list)
        dispatch('listenDeviceState')
      })
    },
    /**
     * 监听设备状态改变
     * @param {*} content
     */
    listenDeviceState({ commit, state }) {
      if (deviceWebsocket && deviceWebsocket.readyState === WebSocket.OPEN) {
        return
      }
      deviceWebsocket = new WebSocket(`${config.wsBaseURL}DeviceStateServer?Id=${localStorage.userId}`)
      deviceWebsocket.onopen = () => {
        console.info('device Connected!')
      }
      deviceWebsocket.onmessage = (result) => {
        let data = JSON.parse(result.data)
        let devices = state.deviceList
        devices.forEach(item => {
          if (item.SerialNumber === data.SerialNumber) {
            if (item.EventObject === 'Device') {
              item.Status = data.EventType
            } else {
              item.DoorStatus = data.EventType
            }
          }
        })
        console.log('设备状态推送消息', data)
        commit('newDeviceList', devices)
      }
      deviceWebsocket.onerror = (error) => {
        console.error('设备webSocket错误：', error.data)
      }
      deviceWebsocket.onclose = () => {
        console.log('device disconnected!')
      }
    },
    listenMessageEnd({ commit, state }) {
      if (messageWebsocket && messageWebsocket.readyState === WebSocket.OPEN) {
        return
      }
      messageWebsocket = new WebSocket(`${config.wsBaseURL}RecordServer?Id=${localStorage.userId}`)
      messageWebsocket.onopen = () => {
        console.log('recodeConnected!')
      }
      messageWebsocket.onmessage = (result) => {
        let messages = state.messageList
        messages.unshift(JSON.parse(result.data))
        if (messages.length > 5) {
          messages.length = 5
        }
        console.log('消息推送', messages)
        commit('newMessageList', messages)
      }
      messageWebsocket.onerror = (error) => {
        console.log(error.data)
      }
      messageWebsocket.onclose = () => {
        console.log('disconnected!')
      }
    },
    listenWarningMessage({ commit, state }) {
      if (warningWebsocket && warningWebsocket.readyState === WebSocket.OPEN) {
        return
      }
      warningWebsocket = new WebSocket(`${config.wsBaseURL}SocketServer?Id=${localStorage.userId}`)
      warningWebsocket.onopen = () => {
        console.info('warning Connected!')
      }
      warningWebsocket.onmessage = (result) => {
        var data = JSON.parse(result.data)
        var message = state.warningMessage
        message.content = {
          type: data.EventType === 'Info' ? 'info' : 'warning',
          title: data.EventName,
          duration: 0,
          desc: `${data.EventName}
          区域:${data.Area},&nbsp;设备名称:${data.DeviceName}(${data.SerialNumber}),&nbsp;&nbsp;时间:${data.EventTime}`
        }
        message.id = message.id + 1
        commit('setWarningMessage', message)
      }
      warningWebsocket.onerror = (error) => {
        console.log(error.data)
      }
      warningWebsocket.onclose = () => {
        console.log('disconnected!')
      }
    },
    sendWarningMessage({ commit, state }, data) {
      if (warningWebsocket) {
        warningWebsocket.send(data)
      }
    }
  }
})

export default store