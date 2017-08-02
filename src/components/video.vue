<template>
  <div class="vedio-container">
    <div class="vedio-content">
      <div class="tree-menu">
        <input v-model="search" @input="searchChange()" placeholder="请输入关键字搜素" />
        <ul>
          <li v-for="area in videoData">
            <p @click="area.show=!area.show"> <i class="iconfont icon-quyu"></i> {{area.menuName}}</p>
            <ul v-show="area.show" class="menu-child">
              <li v-for="camera in area.children">
                <p @click="camera.show=!camera.show"><i class="iconfont icon-shexiang"></i> {{camera.menuName}}</p>
                <ul v-show="camera.show">
                  <li class="gallery-box" v-for="item in camera.children">
                    <p @click.stop.prevent="showVideo(item)">
                      <span class="galleryitem"><i class="iconfont icon-qitiaoxian01"></i> {{item.menuName}}</span>
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <div class="video-layer">
          <h4>请选择视频布局格式</h4>
          <div class="videoLayer-way">
            <i class="iconfont" v-bind:class="[item.addClass,item.isSelect]" v-for="(item,i) in videoLayout" @click="selectLayer(item,i)"></i>
          </div>
        </div>
      </div>
      <div class="iframs-list" ref="hikpanel">
        <hik ref="hik" :screenType="videoSelectBox.type" :width="videoSelectBox.width" :height="videoSelectBox.height" />
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import hik from './hik.vue'
  function setShow(objArry, matchVal) {
    let result = false
    objArry.forEach(m => {
      m.show = setShow(m.children, matchVal)
      if (m.children.length > 0 && m.children.some(c => c.menuName.indexOf(matchVal) !== -1)) {
        m.show = true
        result = true
      }
    })
    return result
  }
  export default {
    components: { 'hik': hik },
    data() {
      return {
        isShowVideo: false,
        search: '',
        videoData: null,
        videoLayout: [{ isSelect: '', addClass: 'icon-gongge3' }, { isSelect: 'selectActive', addClass: 'icon-gongge2' },
        { isSelect: '', addClass: 'icon-gongge1' }, { isSelect: '', addClass: 'icon-gongge' }],
        videoSelectBox: {
          type: 2,
          width: 0,
          height: 0
        },
        videoPlayList: []
      }
    },
    methods: {
      // 初始化数据
      init() {
        axios.get('/api/Camera')
          .then(res => {
            if (res.data.length) {
              this.videoData = res.data.map((m) => {
                m.show = false
                m.children.forEach(t => { t.show = false })
                return m
              })
            }
          })
          .catch(err => {
            alert(err)
          })
      },
      // 搜索事件
      searchChange() {
        setShow(this.videoData, this.search)
      },
      //  管道选择播放
      showVideo(item) {
        this.$refs.hik.play(item.SerialNumber, item.Num)
      },
      // 选择视频布局方式
      selectLayer(item, index) {
        item.isSelect = 'selectActive'
        this.videoLayout = this.videoLayout.map((m) => {
          if (m.addClass !== item.addClass) {
            m.isSelect = ''
          }
          return m
        })
        this.videoSelectBox.type = index + 1
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.$refs.hik.init(this.$refs.hikpanel.clientWidth, this.$refs.hikpanel.clientHeight)
    }
  }

</script>

<style>
  .vedio-container {
    background-color: #f5f5f5;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .vedio-content {
    padding: 30px;
    width: 100%;
    background-color: #f5f5f5;
    border-top: 1px solid #c9c9c9;
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .tree-menu {
    width: 340px;
    padding: 20px;
    background-color: #fff;
    position: relative;
  }

  .tree-menu input {
    width: 300px;
    height: 40px;
    padding: 0 10px;
    margin-bottom: 20px;
    font-size: 18px;
  }

  .tree-menu .iconfont {
    padding-right: 10px;
  }

  .menu-child li {
    padding-left: 20px;
  }

  .icon-qitiaoxian01 {
    font-weight: bolder;
    font-size: 20px;
  }

  .tree-menu p {
    display: flex;
    align-items: center;
  }

  .tree-menu p:hover {
    background-color: #dedede;
  }

  .tree-menu ul li {
    list-style: none;
    cursor: pointer;
    line-height: 2
  }

  .iframs-list {
    display: flex;
    flex: 1;
    padding-left: 20px;
  }


  .galleryitem {
    display: flex;
    align-items: center;
  }

  .video-layer {
    position: absolute;
    bottom: 50px;
    left: 20px;
  }

  .videoLayer-way {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
  }

  .videoLayer-way .iconfont {
    font-size: 31px;
    cursor: pointer;
  }

  .videoLayer-way i.selectActive {
    color: green;
  }
</style>