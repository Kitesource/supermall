<template>
    <div class="tab-bar-item" @click="itemClick">
        <div v-if="!isActive"><slot name="item-icon"></slot></div>
        <div v-else ><slot name="item-icon-active"></slot></div>
        <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
export default {
    name: 'TabBarItem',
    props: {
        path: String,
        activeColor: {
            type:String,
            defaul: '#d81e06 '
        }
    },
    data() {
        return{
            // isActive:false
        }
    },
    computed: {
        isActive(){
            // 如果要检索的字符串值没有出现，则该方法返回 -1。
            return this.$route.path.indexOf(this.path) !== -1
        },
        activeStyle(){
            return this.isActive ? {color:this.activeColor} : {}
        }
    },
    methods: {
        itemClick() {
            // console.log('itemClick');
            this.$router.push(this.path)
        }
    }
}
</script>

<style  scoped>
    .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img{
      width: 24px;
      height: 24px;
      margin-top: 3px;
      margin-bottom: 1px;
  }
</style>