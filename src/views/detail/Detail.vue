<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>

        <scroll class="content" ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @loadImgEvent="loadImgEvent"/>
            <detail-param-info ref="param" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <goods-list ref="recommend" :goods="recommends"/>
        </scroll>
        <detail-bottom-bar @addToCart="addToCart"/>
        <back-top @click.native="backClick" v-show="isShowBackTop"/>
        <!-- <toast :message="message" :show="show"/> -->
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'
// import Toast from 'components/common/toast/Toast'


import { getDetail,Goods,Shop,GoodsParam, getRecommend } from 'network/detail'
import { debouce } from 'common/utils'
import { itemListerMixin } from 'common/mixin'
import { BACK_POSITION } from 'common/const'

export default {
    name: 'Detail',
    components: {
        DetailNavBar,
        getDetail,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        BackTop,
        // Toast
    },
    mixin: [itemListerMixin],
    data() {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo:{},
            recommends: [],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,
            isShowBackTop: false,
            // message: '',
            // show:false
        }
    },
    created() {
        //保存传入的id
        this.iid = this.$route.params.iid

        //根据id请求详细数据
        getDetail(this.iid).then(res => {
            //获取顶部的轮播数据
            const data = res.result
            this.topImages = data.itemInfo.topImages

            //获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

            //创建店铺信息的对象
            this.shop = new Shop(data.shopInfo)

            //保存商品的详细数据
            this.detailInfo = data.detailInfo

            //获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

            //获取评论信息
            if(data.rate.cRate !== 0) {
                this.commentInfo = data.rate.list[0]
            }

            //给getThemeTopY负值
            this.getThemeTopY = debouce( () => {

            })
        })

        //请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.list
        })
    },
    mounted(){ 
    },
    updated() {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themetopYs);
    },
    destoryed() {
        this.$bus.$off('itemImgLoad', this.itemImgListener) 
    },
    methods: {
        loadImgEvent() {
           this.$refs.scroll.refresh()
        },
        titleClick(index) {
            // console.log(index);
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
        },
        contentScroll(position) {
           const  positionY = -position.y
           //将positionY和主题中值进行对比
           /* 
           [0, 2448, 3814, 4010,]
                positionY 在0 ~ 2448之间，index=0
                positionY 在2448 ~ 3814之间，index=1
                positionY 在3814 ~ 4010之间，index=2

                positionY 超过4010时，index=3
           */
          let length = this.themeTopYs.length
          for(let i = 0; i<length; i++){
            //   if(positionY > this.themetopYs[i] && positionY < this.themetopYs[i+1]){
            //       console.log(i);
            //   }
            if((this.currentIndex != i && i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) 
            || (i === length -1 && positionY >= this.themeTopYs[i])){
                this.currentIndex = i;
                // console.log(this.currentIndex);
                this.$refs.nav.currentIndex = this.currentIndex
            }

            //是否显示回到顶部BACK_POSITION
            this.isShowBackTop =  -position.y > BACK_POSITION
          }
        },
         backClick() {
        //    console.log('backClick');
        this.$refs.scroll.scrollTo(0, 0, 300)
       },
       addToCart() {
        //    console.log('addToCart');
        //1.获取购物车需要展示商品信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //将商品添加到购物车
        this.$store.dispatch('addCart',product).then(res => {
            // this.show = true;
            // this.message = res;
            
            // setTimeout( () => {
            //     this.show = false;
            //     this.message = '';
            // },1500)

            this.$toast.show(res,2000)
        })
       }
    }
}
</script>

<style  scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }

    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    .content {
        height: calc(100% - 44px - 49px);
    }
</style>