<script>
if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}
import {onMounted} from 'vue';
import World from '../worlds/world/World.js' 
import World2 from '../worlds/world-matcap-editor/World.js' 
export default {
  setup(){
    onMounted( mounted );
  }
}

function mounted(){
  new World();
  new World2();
}



</script>

<template>
  <canvas class="webgl"></canvas>
  <canvas class="webgl2"></canvas>
</template>

<style scoped>
.webgl{
  outline: none;
  background-color: black;
}
.webgl2{
  position: absolute;
  top: 0;
  right: 0;
  outline: none;
  background-color: black;
  width: 100px;
  height: 100px;
  border: 1px solid white;
}
</style>