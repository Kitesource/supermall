<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"/>

        <scroll class="content" ref="scroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @loadImgEvent="loadImgEvent"/>
            <detail-param-info :param-info="paramInfo"/>
            <detail-comment-info :comment-info="commentInfo"/>
            <goods-list :goods="recommends"/>
        </scroll>
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

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import { getDetail,Goods,Shop,GoodsParam, getRecommend } from 'network/detail'
import { debouce } from 'common/utils'
import { itemListerMixin } from 'common/mixin'

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
        GoodsList
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
            recommends: []
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
        })

        //请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.list
        })
    },
    mounted(){
        
    },
    destoryed() {
        this.$bus.$off('itemImgLoad', this.itemImgListener) 
    },
    methods: {
        loadImgEvent() {
           this.$refs.scroll.refresh()
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
        height: calc(100% - 44px);
    }
</style>