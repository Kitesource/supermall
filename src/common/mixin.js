import {debouce} from './utils'

// 混入
export const itemListerMixin = {
    data() {
        return {
            itemImgListener: null
        }
    },
    mounted() {
        const refresh = debouce(this.$refs.scroll.refresh,200)
        this.itemImgListener = () => {
           refresh()
       }
       this.$bus.$on('itemImgLoad', this.itemImgListener) 
    }
}