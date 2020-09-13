import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

//1.安装插件
Vue.use(Vuex)

const state = {
    cartList: []
}

//2.创建Store对象
const store = new Vuex.Store({
    state,
    //mutations 唯一的目的时修改state中的状态
    mutations,
    actions,
    getters
})

//3.挂载Vue实例上
export default store