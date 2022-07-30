<script setup>
import Events from '../commons/Events.js';
import * as THREE from 'three';
import {reactive, ref, toRaw} from 'vue';
import store from '../store/index.js';
import {Gui} from 'uil';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
}
const lights = reactive([]);
let currentLight = null;
const state = reactive({ isVisible: true })

const lightAdded = (lightModel)=>{
    updateCurrentLight(lightModel);
    lights.push(lightModel);
}

const updateCurrentLight = (lightModel)=>{
    currentLight = lightModel;
    gr.clear();
    
    gr.add(lightModel.light, 'intensity', {min:0, max:10, step:0.01})
    .onChange(()=>{
        Events.emit('matcap:snapshot');
    });
    gr.add(lightModel, 'distance', {min:0, max:10, step:0.01})
    .onChange(()=>{
        Events.emit('matcap:light:update:distance', lightModel);
    });
    let colorObj = {
        color: lightModel.light.color.getHex(),
    };
    gr.add(colorObj, 'color', { ctype:'hex' }).onChange(()=>{
        lightModel.light.color.setHex(colorObj.color);
        Events.emit('matcap:snapshot');
    });

    gr.add('button', {name: 'delete', title: 'delete'}).onChange(()=>{
        lights.splice(lights.indexOf(lightModel), 1);
        Events.emit('matcap:light:delete', lightModel);
        gr.clear();
    });
    
    gr.open();
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
    state.isVisible = false;
    updateCurrentLight(lightModel);
    Events.emit("light:startMoving", lightModel);
}

const onMouseUp = (event, lightModel)=>{
    // event.target.style.pointerEvents = 'auto'
    Events.emit("light:stopMoving", lightModel);
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

const onMoving = (light) =>{
    console.log('moving', light);
}

const onStopMoving = (lightModel) =>{
    state.isVisible = true;
}

Events.on('matcap:editor:light:added', lightAdded);
Events.on('light:stopMoving', onStopMoving)

</script>

<template>
    <div v-if="state.isVisible">
        <div id="matcapLights" :style="getMatcapLightsStyle()">
            <div 
                v-for="light, index in lights"
                :key="index"
                class="light" 
                :style="getCSSPosition(light)"
                @mousedown="onMouseDown($event, light)"
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
        border-width: 1px;
        border-style: solid;
        mix-blend-mode: difference;
    }
    .light:hover{
        background-color: rgba(255, 255, 255, 0.233);
    }
</style>