<script setup>
import Events from '../commons/Events.js';
import * as THREE from 'three';
import {reactive, ref} from 'vue';
import store from '../store/index.js';

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
    return `left:${screenVector.x - 6}px; top:${screenVector.y - 6}px;`;
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

const getMatcapLightsStyle = ()=>{
    return `
        width: ${store.state.matcapEditor.size.width}px;
        height: ${store.state.matcapEditor.size.height}px;
    `;
}


</script>

<template>
    <div id="matcapLights" :style="getMatcapLightsStyle()">
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
        pointer-events: none; 
    }
    .light{
        position: absolute;
        background-color: black;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        touch-action: none;
        pointer-events: all;
        border: 1px solid rgba(255, 255, 255, 0.425);
    }
    .light:hover{
        background-color: rgba(255, 255, 255, 0.233);
    }
</style>