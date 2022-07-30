<script setup>
import {Gui} from 'uil';
import Events from '../commons/Events';
import store from '../store';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
    
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

let currentLight = null;

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
Events.on('matcap:light:update:current', updateCurrentLight);

</script>

<template>
    
</template>