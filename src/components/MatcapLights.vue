<script setup>
import Events from '../commons/Events.js';
import * as THREE from 'three';
import {reactive, ref} from 'vue';
import store from '../store/index.js';
import {Gui} from 'uil';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}
const lights = reactive([]);
let currentLight = null;

const lightAdded = (screenVector)=>{
    // console.log('light added', screenVector);
    gr.clear();
    
    gr.add(screenVector.light, 'intensity', {min:0, max:10, step:0.01})
    .onChange(()=>{
        Events.emit('matcap:snapshot');
    });
    gr.open();
    lights.push(screenVector);
}



const getCSSPosition = (screenVector)=>{
    return `left:${screenVector.x - 6}px; top:${screenVector.y - 6}px;`;
}

const onMouseOver = (event)=>{
    // console.log("onMouseOver");
    Events.emit("focus:changed", "world-matcap-editor-light");
}

const onMouseDown = (event)=>{
    // console.log('mouse down', event);
}

const onMouseUp = (event)=>{
    // console.log('mouse up', event);
}

const onMouseMove = (event, b)=>{
    // console.log('mouse move', event, b);
}

const getMatcapLightsStyle = ()=>{
    return `
        width: ${store.state.matcapEditor.size.width}px;
        height: ${store.state.matcapEditor.size.height}px;
    `;
}

const gui = new Gui({css:`
    top: 202px;
    right: 0px;
`, w:200});
gui.add('button', {name:'export png'}).onChange(()=>{
        Events.emit('matcap:export:png');
    });
gui.add( store.state.matcapEditor.create, 'front');
gui.add( 'grid', { values:['Point','Spot', 'Area'], selectable:true, value:store.state.matcapEditor.create.lightType })
.onChange( (value)=>{
    store.state.matcapEditor.create.lightType = value;
} );
gui.add(store.state.matcapEditor.create, 'distance', {min:0, max:10, step:.1});
gui.add(store.state.matcapEditor.create, 'intensity', {min:0, max:10, step:.1});
gui.add(store.state.matcapEditor.create, 'color', { ctype:'hex' });

let gr = gui.add( 'group', { name:'current light', h:30 });


Events.on('matcap:editor:light:added', lightAdded);

</script>

<template>
    <div>
        <div id="matcapLights" :style="getMatcapLightsStyle()">
            <div 
                v-for="light, index in lights"
                :key="index"
                class="light" 
                :style="getCSSPosition(light)"
                @mouseover="onMouseOver"
                @mousedown="onMouseDown(light)"
            ></div>
        </div>
        <div id="matcapLightsOptions">

        </div>
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