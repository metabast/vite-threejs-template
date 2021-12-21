<script>
import {onMounted} from 'vue';
import World from '../worlds/world/World.js' 
export default {
  setup(){
    onMounted( mounted );
  }
}

function mounted(){
  new World();
}



</script>

<template>
  <canvas class="webgl"></canvas>
</template>

<style scoped>
.webgl{
  outline: none;
  background-color: black;
}
</style>