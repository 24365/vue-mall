<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <Counter v-bind:num="num" v-on:incre="increment" v-on:decre="decrement"></Counter>
    <p>parent: {{num}}</p>
  </div>
</template>

<script>
  import Counter from '@/components/Counter'
  export default {
    name: 'hello',
    data () {
      return {
        num: 0,
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      Counter
    },
    methods: {
      increment(){
        this.num++
      },
      decrement(){
        this.num--
      }
    }
  }
</script>
