<template>
  <div>
    <component v-bind:is="compName" v-if="compName"></component>
  </div>
</template>

<script>
import Vue from 'vue';
import { getParams ,getVueComponentName } from './utils'

export default {
  data() {
    return {
      compName: '',
    };
  },
  created() {
    const storyId = getParams(window.location.search).id;
    const compName = getVueComponentName(storyId);
    if (Vue.component(compName)) {
      this.compName = compName
    }
  },
};
</script>

