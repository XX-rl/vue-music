<template>
  <div>
    <div class="com_swiperImg">
      <van-swipe :autoplay="2000" v-model="loading">
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <img
            class="swiperImg"
            :src="item.url"
            @click="songSheetDetail(index)"
          />
          <span class="imgWord">
            <span class="imgWordWidth">{{ item.name }}</span>
          </span>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div style="padding: 10px 5px">
      <a-player
        :music="songList"
        :list="songList"
        :showlrc="3"
        :narrow="false"
        theme="#749d8d"
        mode="circulation"
        v-if="flag"
        listmaxheight="160px"
        ref="player"
      ></a-player>
    </div>

    <div class="songSheetDetail">
      <van-tabs color="#2f484a">
        <van-tab title="歌单介绍">
          <van-row class="ssDescription">
            <van-col span="8">
              <van-image
                :src="this.images[this.imageIndex].url"
                round
              ></van-image>
            </van-col>
            <van-col span="1"> </van-col>
            <van-col span="15">
              <van-divider>{{ this.images[this.imageIndex].name }}</van-divider>
              <div class="descriptionContent">
                {{ this.images[this.imageIndex].description }}
              </div>
            </van-col>
          </van-row>
        </van-tab>
        <van-tab title="歌单评论" class="ssComment">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="item in citems"
              :key="item"
              title-class="commentTitle"
              value-class="commentValue"
              :title="item.user"
              :value="item.comment"
            />
          </van-list>
        </van-tab>
      </van-tabs>
    </div>

    <!-- <div class="songComments">
      <h3>歌单评论</h3>
      <table>
        <tr>
          <th>用户</th>
          <th>评论详情</th>
        </tr>
        <tr v-for="citem in search()" :key="citem.id">
          <td class="lefttd">{{ citem.user }}</td>
          <td class="righttd">{{ citem.comment }}</td>
        </tr>
      </table>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import VueAplayer from "vue-aplayer";

export default {
  components: {
    "a-player": VueAplayer
  },
  data() {
    return {
      imageIndex: "0",
      loading: false,
      finished: false,
      songSheetHot: "",
      flag: false,
      musicList: "",
      songList: [],
      lrc: "",
      user: "",
      comment: "",
      images: [
        {
          name: "",
          url: "",
          sheetId: "",
          description: ""
        }
      ],
      citems: [
        {
          user: "",
          comment: ""
        }
      ]
    };
  },
  async mounted() {
    //异步加载，先加载出player再使用
    await this.init();
    let aplayer = this.$refs.player;
    aplayer.play();
  },
  methods: {
    async init() {
      // 获得精品歌单
      axios.get("http://localhost:3000/top/playlist/highquality").then(resp => {
        console.log("歌单推荐");
        let playLists = resp.data.playlists;
        //   console.log(playLists);
        // console.log(resp.data.total);

        this.$set(this.images, 0, {
          url: playLists[0].coverImgUrl,
          name: playLists[0].name,
          sheetId: playLists[0].id,
          description: playLists[0].description
        });
        for (let i = 1; i < 5; i++) {
          // let obj = {};
          // obj.name = playLists[i].name;
          // obj.id = playLists[i].id;
          // obj.description = playLists[i].description;
          // obj.coverImgUrl = playLists[i].coverImgUrl;
          this.images.push({
            url: playLists[i].coverImgUrl,
            name: playLists[i].name,
            sheetId: playLists[i].id,
            description: playLists[i].description
          });
        }
        console.log("精品歌单：", this.images);
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= resp.data.total) {
          this.finished = true;
        }
        //   console.log(this.list);
      });

      //这边是引入了axios然后使用的get请求的一个音乐列表接口
      let data = await axios.get(
        "http://localhost:3000/playlist/detail?id=6717604306"
      ); //使用await ，data会等到异步请求的结果回来后才进行赋值
      let comment = await axios.get(
        "http://localhost:3000/comment/playlist?id=6717604306"
      );

      this.$set(this.citems, 0, {
        user: comment.data.comments[0].user.nickname,
        comment: comment.data.comments[0].content
      });

      for (
        let i = 1;
        i <
        (comment.data.comments.length > 5 ? 5 : comment.data.comments.length);
        i++
      ) {
        this.citems.push({
          user: comment.data.comments[i].user.nickname,
          comment: comment.data.comments[i].content
        });
      }

      //以下就是这边对请求的一个处理，看接口了
      if (data && data.status == 200) {
        //200: '服务器成功返回请求的数据
        //console.log(data.data);
        let getMusicList = data.data.playlist.tracks;
        //console.log(getMusicList);
        for (let i = 0; i < getMusicList.length; i++) {
          let obj = {};
          obj.title = getMusicList[i].name;
          obj.artist = getMusicList[i].ar[0].name;
          obj.pic = getMusicList[i].al.picUrl;
          obj.id = getMusicList[i].id;
          let lyric = await axios.get(
            "http://localhost:3000/lyric?id=" + obj.id
          );
          //console.log(lyric);
          if (lyric.data.lrc) obj.lrc = lyric.data.lrc.lyric;
          let url = await axios.get(
            "http://localhost:3000/song/url?id=" + obj.id
          );
          //console.log(url)
          obj.src = url.data.data[0].url;
          //console.log(obj)
          //把数据一个个push到songList数组中，在a-player标签中使用 :music="songList" 就OK了
          this.songList.push(obj);
        }
        //因为是异步请求，所以一开始播放器中是没有歌曲的，所有给了个v-if不然会插件默认会先生成播放器，导致报错(这个很重要)
        this.flag = true;
      }
    },
    onLoad() {
      let id = this.images[this.imageIndex].sheetId;
      let comment = `http://localhost:3000/comment/playlist?id=${id}`;
      console.log("comment:  ", comment);
      this.citems = [];
      axios.get(comment).then(resp => {
        let hotcommentList = resp.data.hotComments;
        console.log("hotcommentList:  ", hotcommentList); 
        for (
          let i = 0;
          i < (hotcommentList.length > 5 ? 5 : hotcommentList.length);
          i++
        ) {
          this.citems.push({
            user: hotcommentList[i].user.nickname,
            comment: hotcommentList[i].content
          });
        }
         console.log("citems:  ", this.citems); 
      });
      this.loading = false;
    },
    search() {
      return this.citems.filter(item => {
        return item;
      });
    },
    songSheetDetail(index) {
      let id = this.images[index].sheetId;

      console.log("歌单id: ", id);
      let data = `http://localhost:3000/playlist/detail?id=${id}`;
      console.log("歌单url: ", data); 
      this.songList = [];

      console.log("songList: ", this.songList);
      axios.get(data).then(resp => {
        let getMusicList = resp.data.playlist.tracks;
        console.log("getMusicList: ", getMusicList);

        for (let i = 0; i < getMusicList.length; i++) {
          let obj = {};
          obj.title = getMusicList[i].name;
          obj.artist = getMusicList[i].ar[0].name;
          obj.pic = getMusicList[i].al.picUrl;
          obj.id = getMusicList[i].id;

          axios.get("http://localhost:3000/lyric?id=" + obj.id).then(resp => {
            let lyric = resp;
            if (lyric.data.lrc) obj.lrc = lyric.data.lrc.lyric;
            axios
              .get("http://localhost:3000/song/url?id=" + obj.id)
              .then(resp => {
                let url = resp;
                obj.src = url.data.data[0].url;
              });
          });

          this.songList.push(obj);
        }
        console.log("songList: ", this.songList);
        this.imageIndex = index;
        console.log("img~~ ", this.images[this.imageIndex]);
      });
 
      let comment = `http://localhost:3000/comment/playlist?id=${id}`;
      console.log("comment:  ", comment);
      this.citems = [];
      axios.get(comment).then(resp => {
        let hotcommentList = resp.data.hotComments;
        console.log("hotcommentList:  ", hotcommentList); 
        for (
          let i = 0;
          i < (hotcommentList.length > 5 ? 5 : hotcommentList.length);
          i++
        ) {
          this.citems.push({
            user: hotcommentList[i].user.nickname,
            comment: hotcommentList[i].content
          });
        }
         console.log("citems:  ", this.citems); 
      });
      this.loading = false;
      
    }
  }
};
</script>

<style scoped>
/* h2 {
  height: 60px;
  background-color: #2f484a;
  color: ghostwhite;
  margin: auto;
  line-height: 60px;
  border-radius: 10px;
}

.songComments {
  background-color: white;
  border-radius: 5px;
  margin: 10px;
}
.songComments h3 {
  height: 60px;
  background-color: #749d8d;
  color: ghostwhite;
  margin: auto;
  line-height: 60px;
  border-radius: 10px;
  margin-bottom: 10px;
}
.songComments table {
  border: 1px solid gainsboro;

  background-color: rgb(255, 250, 250);
  border-spacing: 2px;
}
.songComments table .lefttd {
  background-color: #acbca6;
  border-radius: 3px;
  color: rgb(245, 243, 243);
} 
.songComments table .righttd {
  background-color: #d6d3d0;
  color: rgb(34, 31, 31);
  border-radius: 5px;
} */

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
  left: 1.5vw;
  width: 75vw;
  overflow: hidden;
  text-overflow: clip;
  white-space: pre;
  padding: 0 1vw;
}
/* 轮播图的指示点 */
.com_swiperImg /deep/ .van-swipe__indicators {
  bottom: 5vw;
  left: 86%;
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

.songSheetDetail .ssDescription {
  width: 97%;
  font-size: small;
}
.songSheetDetail .ssDescription .van-image {
  left: 8%;
  padding: 5px;
  margin-top: 60px;
}
.songSheetDetail .descriptionContent {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
   
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 10;
}

.songSheetDetail .ssComment .commentTitle{
  color: #899783;
  font-weight:600;
   max-width: 30%; 
}

.songSheetDetail .ssComment .commentValue{
   
  color: #86817c;
  size: 10px;
   max-width: 65%; 
}
</style>
