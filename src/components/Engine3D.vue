<script setup>
import {onMounted} from 'vue';
import World from '../worlds/world-basic-glsl/World.js' 
import Events from '../commons/Events.js';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}

onMounted (()=>{
    new World();
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
</template>

<style scoped>
.webgl{
  outline: none;
  background-color: white;
}
</style>