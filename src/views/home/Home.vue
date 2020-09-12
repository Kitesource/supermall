<template>
    <div id="home">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <tab-control class="tab-control"
                        :titles="['流行', '新款', '精选']"
                        @tabClick="tabClick"
                        ref="tabControl1"
                        v-show="isTabFixed"/>

        <scroll 
        class="content" 
        ref="scroll" 
        :probe-type="3" 
        @scroll="contentScroll"
        :pull-up-load="true"
        @pullingUp="loadMore" >
           <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/> 
           <recommend-view :recommends="recommends"/>
           <feature-view/>
           <tab-control :titles="['流行', '新款', '精选']"
                        @tabClick="tabClick"
                        ref="tabControl2"/>
            <goods-list :goods="showGoods"/>
        </scroll>

        <!-- .native 监听组件的原生事件，必须给事件加上.native修饰 -->
        <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import {getHomeMultidata, getHomeGoods } from 'network/home'
import {debouce } from 'common/utils'
import {itemListenerMixin} from 'common/utils'

export default {
    name: 'Home',
    components: {
        NavBar,
        HomeSwiper,
        RecommendView,
        FeatureView,
        TabControl,
        GoodsList,
        Scroll,
        BackTop
    },
    mixin:[itemListenerMixin],
    data() {
        return {
            banners: [],
            recommends: [],
            goods: {
                'pop' :{page: 0, list: []},
                'new' :{page: 0, list: []},
                'sell' :{page: 0, list: []}
            },
            currentType: 'pop',
            isShowBackTop: false,
            tabOffsetTop: 0,
            isTabFixed: false,
            saveY: 0,
        }
    },
    computed: {
        showGoods() {
            return this.goods[this.currentType].list
        }
    },
    //创建页面时调用
    created() {
        //1.请求多个数据
        this.getHomeMultidata();
        //2.请求商品数量
        this.getHomeGoods('pop');
        this.getHomeGoods('new');
        this.getHomeGoods('sell');
    },
    //进入页面时调用
    activated() {
        // console.log('进入');
        this.$refs.scroll.scrollTo(0,this.saveY,0)
        
        this.$refs.scroll.refresh()
    },
    //离开页面时调用
    deactivated() {
        // console.log('离开');
        //1.保存Y值
        this.saveY = this.$refs.scroll.getScrollY

        //2.取消全局事件的监听
        this.$bus.$off('itemImgLoad', this.itemImgListener)

    },
    //创建完成时调用
    mounted() {
    },
    methods: {
        /* 
            事件监听的方法
        */
       tabClick(index) {
           switch(index) {
               case 0:
                   this.currentType = 'pop'
                   break;
                case 1:
                    this.currentType = 'new'
                    break;
                case 2:
                    this.currentType = 'sell'
                    break;
           }
           this.$refs.tabControl1.currentIndex = index;
           this.$refs.tabControl2.currentIndex = index;
       },
       backClick() {
        //    console.log('backClick');
        this.$refs.scroll.scrollTo(0, 0, 300)
       },
       contentScroll(position) {
        // console.log(position);
        //1.判断backTop是否显示
        this.isShowBackTop =  -position.y > 1000

        //2.决定tabControl是否吸顶（posititon = fixed）
        this.isTabFixed = -position.y > this.tabOffsetTop
       },
       //实现加载更多的方法
       loadMore() {
           this.getHomeGoods(this.currentType)
       },
       swiperImageLoad() {
        //获取tabControl的offsetTop
        //所有组件都有一个属性$el,用来获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
       },

        /* 
            网络请求相关的方法
        */
        getHomeMultidata() {
            getHomeMultidata().then(res => {
                // console.log(res);
                this.banners = res.data.banner.list;
                this.recommends = res.data.recommend.list;
            })
        },
        getHomeGoods(type) {
            const page = this.goods[type].page + 1;
            getHomeGoods(type,page).then(res => {
                this.goods[type].list.push(...res.data.list)
                this.goods[type].page += 1

                // 实现可多次上拉加载
                this.$refs.scroll.finishPullUp()
            })
        }
    }
}
</script>

<style  scoped>

    #home {
        /* padding-top: 44px; */
        height: 100vh;
        position: relative;
    }

    .home-nav{
        background-color: var(--color-tint);
        color: #fff;

        /* 使用浏览器原生滚动时，固定头部导航 */
        /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9; */
    }

    /* .tab-control{
        position: sticky;
        top: 43px;
        z-index: 9;
    } */

    .tab-control {
        position: relative;
        z-index: 9;
    }

    .content{
        /* height: 300px; */
        overflow: hidden;
        position: absolute;
        left: 0;
        right:0;
        bottom: 49px;
        top: 44px;
    }

</style>