<template>
    <div class="model">
      <div class="md-modal modal-msg md-modal-transition" v-if="mdShow" v-bind:class="{'md-show':closeModal}">
        <div class="md-modal-inner">
          <div class="md-top">
            <slot name="title"></slot>
            <button class="md-close" @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    export default {
        name: 'model',
      props:['mdShow'],
        data () {
            return {
            }
        },
        methods:{
          closeModal(){
              this.$emit("close");
          }
        },
        components: {}
    }
</script>
