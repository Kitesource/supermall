<template>
    <div cart-list>
        <scroll class="content" ref="scroll">
            <!-- <li v-for="item in cartList"> {{item}}</li> -->
            <cart-list-item 
            v-for="(item, index) in cartList"
            :key="index" 
            :item-info="item"/>
        </scroll> 
    </div> 
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'

export default {
    name: 'CartList',
    components: {
        Scroll,
        CartListItem,
    },
    computed: {
        ...mapGetters(['cartList'])
    },
    activated() {
        this.$refs.scroll.refresh()
    }
}
</script>

<style  scoped>
    .cart-list{
        height: calc(100% - 44px -49px - 44px);
    }
    .content{
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 49px;
    overflow: hidden;
  }
</style>