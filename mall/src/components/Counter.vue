<template>
  <div class="counter">
    <p>{{num}}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script>
  export default {
    name: 'counter',
    props:['num'],
    data () {
      return {
      }
    },
    methods: {
      increment(){
        this.$emit("incre")
      },
      decrement(){
        this.$emit("decre")
      }
    }
  }
</script>
<style scoped>

</style>
