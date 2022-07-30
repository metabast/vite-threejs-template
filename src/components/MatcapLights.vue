<script setup>
import Events from '../commons/Events.js';
import * as THREE from 'three';
import {onMounted, reactive, ref, toRaw} from 'vue';
import store from '../store/index.js';
import MatcapProperties from './MatcapProperties.vue';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}
let lights = store.state.matcapEditor.lights;
onMounted(()=>{});
let currentLight = null;
const state = reactive({ isVisible: true })

const lightAdded = (lightModel)=>{
    updateCurrentLight(lightModel);
    Events.emit('matcap:light:update:current', lightModel);
    lights.push(lightModel);
}

const updateCurrentLight = (lightModel)=>{
    currentLight = lightModel;
}

const getCSSPosition = (lightModel)=>{
    return `
        left:${lightModel.screenPosition.x - 6}px;
        top:${lightModel.screenPosition.y - 6}px;
        border-color:${lightModel.light.uuid === currentLight.light.uuid ? '#00ffff' : '#ffffff'};
    `;
}

const onMouseDown = (event, lightModel)=>{
    // event.target.style.pointerEvents = 'none'
    store.state.matcapEditor.isUILightVisible = false;
    updateCurrentLight(lightModel);
    Events.emit('matcap:light:update:current', lightModel);
    Events.emit("matcap:light:startMoving", lightModel);
}

const getMatcapLightsStyle = ()=>{
    return `
        width: ${store.state.matcapEditor.size.width}px;
        height: ${store.state.matcapEditor.size.height}px;
    `;
}

Events.on('matcap:editor:light:added', lightAdded);

</script>

<template>
    <div >
        <div id="matcapLights" :style="getMatcapLightsStyle()" v-if="store.state.matcapEditor.isUILightVisible">
            <div 
                v-for="light, index in store.state.matcapEditor.lights"
                :key="index"
                class="light" 
                :style="getCSSPosition(light)"
                @mousedown="onMouseDown($event, light)"
            ></div>
        </div>
        <MatcapProperties />
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
        border-width: 1px;
        border-style: solid;
        mix-blend-mode: difference;
        cursor: pointer;
    }
    .light:hover{
        background-color: rgba(255, 255, 255, 0.233);
    }
</style>