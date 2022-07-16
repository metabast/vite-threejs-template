<script setup>
import Events from '../commons/Events.js';
import * as THREE from 'three';
import {reactive, ref} from 'vue';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}
const lights = reactive([]);

const lightAdded = (screenVector)=>{
    console.log('light added', screenVector);
    lights.push(screenVector);
}

Events.on('matcap:editor:light:added', lightAdded);

const getCSSPosition = (screenVector)=>{
    return `left:${screenVector.x - 5}px; top:${screenVector.y - 5}px;`;
}

const onMouseOver = (event)=>{
    console.log("onMouseOver");
    Events.emit("focus:changed", "world-matcap-editor-light");
}

const onMouseDown = (event)=>{
    console.log('mouse down', event);
}

const onMouseUp = (event)=>{
    console.log('mouse up', event);
}

const onMouseMove = (event, b)=>{
    console.log('mouse move', event, b);
}


</script>

<template>
    <div id="matcapLights">
        <div 
            v-for="light in lights" 
            class="light" 
            :style="getCSSPosition(light)"
            @mouseover="onMouseOver"
            @mousedown="onMouseDown(light)"
        ></div>
    </div>
</template>

<style>
    #matcapLights{
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 200px;
        /* touch-action: none;
        pointer-events: none; */
    }
    .light{
        position: absolute;
        background-color: white;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        /* touch-action: none;
        pointer-events: all; */
    }
</style>