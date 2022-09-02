<script setup>
import {Gui} from 'uil';
import Events from '../commons/Events';
import store from '../store';
import World from '../worlds/world-basic-glsl/World';

if (import.meta.hot) {
    import.meta.hot.dispose( (data) => {
        import.meta.hot.invalidate();
    } )
    
}

const lights = store.state.matcapEditor.lights;
const gui = new Gui({css:`
    top: 202px;
    right: 0px;
`, w:200});

// gui.add(store.state.matcapEditor.create, 'distance', {min:0, max:10, step:.1});

let sizes = store.state.matcapEditor.sizes.exportRatios.map( (value)=> value * store.state.matcapEditor.sizes.exportDefault);
gui.add('grid', { name:'', values:sizes, selectable:true, value: store.state.matcapEditor.sizes.exportDefault })
.onChange( (value)=>{
    store.state.matcapEditor.sizes.exportRatio = value/store.state.matcapEditor.sizes.exportDefault;
} );

gui.add('button', {name:'export png'}).onChange(()=>{
    Events.emit('matcap:export:png', true);
    });

gui.add( store.state.matcapEditor.create, 'front');
gui.add( 'grid', { values:['Point','Spot', 'Area'], selectable:true, value:store.state.matcapEditor.create.lightType })
.onChange( (value)=>{
    store.state.matcapEditor.create.lightType = value;
} );

let grMat = gui.add( 'group', { name:'Material', h:30 });

let grAmbiant = gui.add( 'group', { name:'Ambiant', h:30 });

const colorObj = {ambiantColor:0xffffff};
grAmbiant.add(colorObj, 'ambiantColor', { ctype:'hex' }).onChange(()=>{
    store.state.matcapEditor.ambiant.color.setHex(colorObj.ambiantColor);
    Events.emit('matcap:ambiant:update');
});

grAmbiant.add(store.state.matcapEditor.ambiant, 'intensity', {name:'ambiant', min:0, max:1, step:.001, precision:3})
.onChange( (value)=>{
    Events.emit('matcap:ambiant:update');
} );

let grCreate = gui.add( 'group', { name:'Create', h:30 });
grCreate.add(store.state.matcapEditor.create, 'distance', {min:0, max:10, step:.1});
grCreate.add(store.state.matcapEditor.create, 'intensity', {min:0, max:10, step:.1});
grCreate.add(store.state.matcapEditor.create, 'color', { ctype:'hex' });






let gr = gui.add( 'group', { name:'current light', h:30 });

let currentLight = null;

const updateCurrentLight = (lightModel)=>{
    if(currentLight === lightModel){
        return;
    }
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
    if(lightModel.light.type === 'PointLight'){
        gr.add(lightModel.light, 'distance', {min:0, max:10, step:0.01})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });
        gr.add(lightModel.light, 'decay', {min:0, max:100, step:0.01})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });
    }
    if(lightModel.light.type === 'RectAreaLight'){

        gr.add(lightModel, 'lookAtTarget');

        gr.add(lightModel.light, 'width', {min:0, max:100, step:0.01})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });
        gr.add(lightModel.light, 'height', {min:0, max:100, step:0.01})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });

        gr.add('number', {name:'target', value:lightModel.positionTarget.toArray(), step:0.01, h:25}).onChange((value)=>{
            lightModel.positionTargetX = value[0];
            lightModel.positionTargetY = value[1];
            lightModel.positionTargetZ = value[2];
            Events.emit('matcap:snapshot');
        });
    }
    if(lightModel.light.type === 'SpotLight'){

        gr.add(lightModel.light, 'angle', {min:0, max:Math.PI/2, step:0.001, precision:3})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });

        gr.add(lightModel.light, 'penumbra', {min:0, max:1, step:0.001, precision:3})
        .onChange(()=>{
            Events.emit('matcap:snapshot');
        });

        gr.add('number', {name:'target', value:[0,0,0], step:0.01, h:25}).onChange((value)=>{
            console.log(value);
            lightModel.positionTargetX = value[0];
            lightModel.positionTargetY = value[1];
            lightModel.positionTargetZ = value[2];
            console.log(lightModel.light);
            Events.emit('matcap:snapshot');
        });
    }

    gr.add('button', {name: 'delete', title: 'delete'}).onChange(()=>{
        lights.splice(lights.indexOf(lightModel), 1);
        Events.emit('matcap:light:delete', lightModel);
        gr.clear();
    });
    
    gr.open();
}
Events.on('matcap:light:update:current', updateCurrentLight);

Events.on('matcap:content:ready', (content)=>{
    grMat.add(content.sphereRenderMaterial, 'roughness', {min:0, max:1, step:0.01}).onChange((value)=>{
        Events.emit('matcap:snapshot');
    }).listen();
    grMat.add(content.sphereRenderMaterial, 'metalness', {min:0, max:1, step:0.01}).onChange((value)=>{
        Events.emit('matcap:snapshot');
    }).listen();
        let colorObj = {
            color: content.sphereRenderMaterial.specularColor.getHex(),
            specularColor: content.sphereRenderMaterial.specularColor.getHex(),
        };
    
    grMat.add(colorObj, 'color', { ctype:'hex' }).onChange(()=>{
        content.sphereRenderMaterial.color.setHex(colorObj.color);
        Events.emit('matcap:snapshot');
    });

    // grMat.add(content.sphereRenderMaterial, 'specularIntensity', {min:0, max:1, step:0.01}).onChange((value)=>{
    //     Events.emit('matcap:snapshot');
    // }).listen();

    // grMat.add(colorObj, 'color', { ctype:'hex' }).onChange(()=>{
    //     content.sphereRenderMaterial.specularColor.setHex(colorObj.specularColor);
    //     console.log(content.sphereRenderMaterial.specularColor);
    //     Events.emit('matcap:snapshot');
    // });

});

let grObjects = gui.add( 'group', { name:'Objects', h:30 });
grObjects.add( store.state.models.visible, 'torusKnot').onChange( ()=>{
    Events.emit('object:visible:update');
} );
grObjects.add( store.state.models.visible, 'spheres').onChange( ()=>{
    Events.emit('object:visible:update');
} );
grObjects.add( store.state.models, { name:'Power', value:store.state.models.power, min:0, max:10, h:25 }).onChange((value)=>{
    store.state.models.power = value;
    Events.emit('object:power:update');
})
</script>

<template>
    
</template>