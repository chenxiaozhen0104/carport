<template>
  <div class="iframe-module">
    <iframe class="module-item" v-if="playing" frameborder="0" :width="wd" :height="ht" crolling="no" :src="videoUrl"></iframe>
  </div>
</template>
<script>
  const url = 'http://192.168.1.240:9010/Content/video/iframe.html'
  export default {
    name: 'iframe-count',
    props: ['serialNumber', 'device', 'channel', 'wd', 'ht'],
    data() {
      return {
        devices: this.$store.state.deviceList,
        playing: true
      }
    },
    computed: {
      videoUrl() {
        let device, camera
        if (this.serialNumber) {
          device = this.devices.filter((res) => {
            return res.SerialNumber === parseInt(this.serialNumber)
          })[0]
        } else {
          device = this.device
        }
        if (!device) {
          return url
        }
        camera = device.Cameras[0]
        let deviceUrl = `${url}?ip=${camera.Ip}&port=${camera.Port}&admin=${camera.Name}&password=${camera.Password}&channel=${this.channel || 1}`
        console.log(deviceUrl, '视频播放地址')
        return deviceUrl
      }
    },
    methods: {
    },
    created() {
    }
  }

</script>
<style>
  .iframe-module,
  .module-item {
    display: flex;
    flex: 1;
  }
</style>