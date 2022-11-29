<script setup>
import {onMounted} from 'vue';
import World from '../worlds/world-text-ure/World.js' 
import Events from '../commons/Events.js';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}

onMounted (()=>{
    World.init();
})

const onMouseOverWorldMatcapPreview = (event)=>{
    Events.emit('focus:changed', 'world-matcap-preview');
}

const onMouseOverWorldMatcapEditor= (event)=>{
    Events.emit('focus:changed', 'world-matcap-editor');
}

</script>

<template>
  <canvas class="webgl" />
  <canvas
    id="myCanvas"
    width="1024"
    height="1024"
  />
</template>

<style scoped>
.webgl{
  outline: none;
  background-color: white;
}
#myCanvas{
    position: absolute;
    top: 100px;
    left: 0;
    background-color: beige;
    width: 128px;
    height: 128px;
}
</style>