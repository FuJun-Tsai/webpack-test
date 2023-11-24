<template>
  <div class="about">
    <h1>{{ h1text }}</h1>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const h1text = ref('here is About Page');
</script>
<style lang="scss">
h1{
  text-align: center;
}
</style>