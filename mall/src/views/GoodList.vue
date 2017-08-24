<template>
  <div class="GoodList">
    <nav-header></nav-header>
    <nav-bread><span>good</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default" v-bind:class="{'cur':sortPrice}" @click="sortGoods('Default')">Default</a>
          <a href="javascript:void(0)" class="price" v-bind:class="{'cur':!sortPrice}" @click="sortGoods('Price')">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}"
                     @click="setPriceFilter('all')">All</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked===index}">{{price.startPrice|currency('¥',2)}} - {{price.endPrice|currency('¥',2)}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt="商品图片"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice|currency('¥',2)}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-show="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                   infinite-scroll-distance="10">
                <img src="./../assets/loading-spinning-bubbles.svg" alt="加载中">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Model v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车
      </p>
      <a slot="btnGroup" href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
    </Model>
    <Model v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup" style="width: 100%">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </Model>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import '@/assets/css/product.css'
  import NavFooter from '@/components/Footer'
  import NavHeader from '@/components/Header'
  import Model from '@/components/Model'
  import NavBread from '@/components/NavBread'
  import axios from 'axios'
  export default {
    name: 'GoodList',
    data () {
      return {
        goodList: [],
        priceFilter: [
          {
            startPrice: "0",
            endPrice: "100"
          },
          {
            startPrice: "100",
            endPrice: "500"
          },
          {
            startPrice: "500",
            endPrice: "1000"
          },
          {
            startPrice: "1000",
            endPrice: "5000.00"
          }
        ],
        mdShow: false,
        busy: true,
        scrollStop: false,
        loading: false,
        mdShowCart:false,
        sortPrice: true,
        priceChecked: "all",
        filterBy: false,
        overLayFlag: false,
        sortFlag: true,
        page: 1,
        pageSize: 8
      }
    },
    mounted(){
      this.getGoodList();
    },
    components: {
      NavFooter,
      NavBread,
      NavHeader,
      Model
    },
    methods: {
      getGoodList(flag){
        let params = {
          pageSize: this.pageSize,
          page: this.page,
          sort: this.sortFlag ? 1 : -1,
          priceChecked: this.priceChecked
        };
        this.loading = true;
        axios.get('/goods/list', {
          params
        }).then((result) => {
          this.loading = false;
          let res = result.data;
          if (res.status === "0") {
            if (flag) {
              if (res.result.count === 0) {
                this.busy = true;
                this.scrollStop = true;
              } else {
                this.goodList = this.goodList.concat(res.result.list);
                this.busy = false;
                this.scrollStop = false;
              }
            } else {
              this.goodList = res.result.list;
              this.busy = false;
              this.scrollStop = false;
            }
          } else {
            this.goodList = [];
          }
        })
      },
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true
      },
      setPriceFilter(index){
        this.priceChecked = index;
        this.page = 1;
        this.getGoodList();
        this.closePop();
      },
      closePop(){
        this.filterBy = false;
        this.overLayFlag = false
      },
      sortGoods(id){
        if (id === 'Default' && !this.sortFlag) {
          this.sortFlag = true;
          this.sortPrice = true;
          this.page = 1;
          this.getGoodList();
        } else if (id === 'Price' && this.sortFlag) {
          this.sortFlag = false;
          this.sortPrice = false;
          this.page = 1;
          this.getGoodList();
        }
      },
      loadMore(){
        if (!this.scrollStop) {
          let timer;
          this.busy = true;
          if (!!timer) {
            return null
          }
          timer = setTimeout(() => {
            this.page++;
            this.getGoodList(true);
            clearTimeout(timer);
            this.busy = false;
          }, 500);
        }
      },
      addCart(productId){
        axios.post('/goods/addCart', {
          productId: productId
        }).then((response) => {
          let res = response.data;
          if (res.status === "0") {
            this.mdShowCart =true;
            this.$store.commit("updateCartCount",1);
          } else {
            this.mdShow = true
          }
        })
      },
      closeModal(){
        this.mdShow = false;
      }
    }
  }
</script>
