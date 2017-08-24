import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    nickName:"",
    cartCount: 0,
    totalPrice: 0,
    updateUserInfo: ""
  },
  mutations:{
    increment(state,price){
      state.totalPrice +=price
    },
    decrement(state,price){
      state.totalPrice -=price
    },
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
})
