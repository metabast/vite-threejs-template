<script setup>
import {onMounted} from 'vue';
import WorldMatcapPreview from '../worlds/world/World.js' 
import WorldMatcapEditor from '../worlds/world-matcap-editor/World.js' 
import Events from '../commons/Events.js';
import MatcapLights from './MatcapLights.vue';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}

onMounted (()=>{
  WorldMatcapPreview.getInstance().init();
  WorldMatcapEditor.getInstance().init();
})

const onMouseOverWorldMatcapPreview = (event)=>{
  Events.emit("focus:changed", "world-matcap-preview");
}

const onMouseOverWorldMatcapEditor= (event)=>{
  Events.emit("focus:changed", "world-matcap-editor");
}

</script>

<template>
  <canvas class="webgl"></canvas>
  <canvas class="webgl2"></canvas>
  <MatcapLights/>
</template>

<style scoped>
.webgl{
  outline: none;
  background-color: white;
}
.webgl2{
  position: absolute;
  top: 0;
  right: 0;
  outline: none;
  background-color: black;
  width: 200px;
  height: 200px;
  border: 1px solid white;
}
</style>