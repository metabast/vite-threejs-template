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
    top: 50px;
    left: 0px;
`, w:200});

let grObjects = gui.add( 'group', { name:'Objects', h:30 });
grObjects.add( store.state.models.visible, 'torusKnot').onChange( ()=>{
    Events.emit('object:visible:update');
} );
grObjects.add( store.state.models.visible, 'spheres').onChange( ()=>{
    Events.emit('object:visible:update');
} );
grObjects.add( store.state.models, 'power', {  min:0, max:10, h:25 }).onChange((value)=>{
    // store.state.models.power = value;
    Events.emit('object:power:update');
})
grObjects.open();

</script>