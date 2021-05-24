<!-- 推荐歌单 -->
<template>
  <div class=""> 
    <div class="com_swiperImg">
      <van-swipe :autoplay="2000"  v-model="loading">
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <img class="swiperImg" :src="item.url" />
          <span class="imgWord">
            <span class="imgWordWidth">{{ item.name }}</span>
          </span>
        </van-swipe-item>
      </van-swipe>
    </div> 
  </div>
</template>

<script>
import axios from "axios";

//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  name: "highqualitySongSheet",
  data() {
    //这里存放数据
    return {
      images: [
         {
          name: '',
          url:''
        } 
      ],
      list:[],
      loading: false,
      finished: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    songSheetDetail(index) {},
    
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { 
      axios.get("http://localhost:3000/top/playlist/highquality").then(resp => {
        console.log("歌单推荐");
        let playLists = resp.data.playlists;
        //   console.log(playLists);
        // console.log(resp.data.total);
         
        this.$set(this.images, 0, {
        url:playLists[0].coverImgUrl, name:playLists[0].name
      });
        for (let i = 1; i < 5; i++) {
          let obj = {};
          obj.name = playLists[i].name;
          obj.id = playLists[i].id;
          obj.description = playLists[i].description;
          obj.coverImgUrl = playLists[i].coverImgUrl;
          this.images.push({url:playLists[i].coverImgUrl, name:playLists[i].name});
          console.log(obj);
          this.list.push(obj);
        }
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= resp.data.total) {
          this.finished = true;
        }
        //   console.log(this.list);
      });

  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

.com_swiperImg {
  margin-top: 2vw;
}
.swiperImg {
  width: 93vw;
  height: 45vw;
  border-radius: 3vw;
  border: 1px solid ghostwhite;
}
/* 图片的文字 */
.imgWord {
  position: absolute;
  bottom: 1.6vw;
  left: 3.5vw;
  width: 91vw; 
  height: 10vw;
  line-height: 10vw;
  text-align: left;
  padding-left: 2vw;
  border-radius: 0 0 3vw 3vw;
  background: rgba(22, 22, 22, 0.5);
  color: #feffff;
}
/* 文字的宽度 */
.imgWordWidth {
  position: absolute;
  bottom: 0vw;
  left: 3vw;
  width: 75vw;
  overflow: hidden;
  text-overflow: clip;
  white-space: pre;
  padding: 0 1vw;
}
/* 轮播图的指示点 */
.com_swiperImg /deep/ .van-swipe__indicators {
  bottom: 5vw;
  left: 85%;
}
/* 轮播图的指示点（大小） */
.com_swiperImg /deep/ .van-swipe__indicator {
  width: 2vw;
  height: 2vw;
}
/* 轮播图的指示点颜色 */
.com_swiperImg /deep/ .van-swipe__indicator--active {
  background-color: #fdc034;
}

</style>
