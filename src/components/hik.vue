<template>
  <div id="tingshuoidyaohenchangcaibuhuichongfu"></div>
</template>
<script>
  let videoCtrl = window.WebVideoCtrl
  export default {
    props: ['screenType', 'borderColor', 'backgroundColor', 'selectBorderColor'],
    data() {
      return {
        loginList: [],
        devices: this.$store.state.deviceList
      }
    },
    methods: {
      _login(ip, port, username, password, callback) {
        videoCtrl.I_Login(ip, 1, port, username, password, {
          success: (xmlDoc) => {
            callback(ip)
          }
        })
      },
      play(sn, num) {
        videoCtrl.I_Stop()
        var device = this.devices.filter((m) => m.SerialNumber === sn)[0].Cameras[0]
        if (this.loginList.some(m => m.Ip === device.Ip)) {
          this._play(device.Ip, 1, num)
        } else {
          this._login(device.Ip, device.Port, device.Name, device.Password, (ip) => {
            this.loginList.push(device)
            this._play(ip, 1, num)
          })
        }
      },
      _play(loginIp, streamType, channelId, screenIndex) {
        videoCtrl.I_StartRealPlay(loginIp, {
          iStreamType: streamType,
          iChannelID: channelId,
          iWndIndex: screenIndex,
          bZeroChannel: false
        })
      },
      changeScreenType(type) {
        videoCtrl.I_ChangeWndNum(type)
      },
      capturePic(fileName) {
        videoCtrl.I_CapturePic(fileName)
      },
      init(width, height) {
        videoCtrl.I_InitPlugin(width, height, {
          bWndFull: true,
          bDebugMode: true, // 调试模式
          iWndowType: this.screenType,
          szColorProperty: `plugin-background:1e1e1e; sub-background:${this.backgroundColor || '1e1e1e'}; sub-border:${this.backgroundColor || '000000'}; sub-border-select:${this.backgroundColor || '4e94ce'}`,
          cbSelWnd(xmlDoc) {
            this.$emit('selectScreenChange', xmlDoc)
          },
          cbEvent(type, number) {
            this.$emit('error', type, number)
            console.log(type, number)
          }
        })
        videoCtrl.I_InsertOBJECTPlugin('tingshuoidyaohenchangcaibuhuichongfu')
      }
    },
    mounted() {
      this.$watch('screenType', () => {
        this.changeScreenType(this.screenType)
      })
    }
  }

</script>