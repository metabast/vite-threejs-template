import * as THREE from 'three';
import Events from '../../commons/Events';
const size = .28;
// SHADERS
import vertexShader from './shaders/default-vertex.glsl';
import fragmentShader from './shaders/default-fragment.glsl';
import World from './World';
import { getScreenPosition } from '../../commons/VectorHelper';
import store from '../../store';
import { Vector3 } from 'three';

const cameraSnapshot = new THREE.OrthographicCamera( -size, size, size, -size, .5, 200 );
cameraSnapshot.position.set( 0, 0, 1 );

const planeGeometry = new THREE.PlaneGeometry(2,2);
const planeMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff});
planeMaterial.transparent = true;
planeMaterial.opacity = 0;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);


const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


class Content{
    constructor(){
        this.world = World.getInstance();
        this.renderer = World.getInstance().renderer;
        this.scene = World.getInstance().scene;
        this.camera = World.getInstance().camera;

        this.scene.add(plane);
        this.scene.add(sphere);

        this.arrowHelper = new THREE.ArrowHelper( new Vector3(), new Vector3(), this.length, '#ff0000' );
        this.scene.add( this.arrowHelper );

        Events.on('focus:changed', this.onFocusChanged.bind(this));

        this.world.canvas.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    }

    update(clock){
    }

    onFocusChanged(focusName){
        this.isFocused = focusName === 'world-matcap-editor';
        if(this.isFocused){
            this.camera.add(cameraSnapshot);
        }else{
            this.camera.remove(cameraSnapshot);
        }
    }

    onPointerDown(event){

        pointer.set(( event.offsetX / store.state.matcapEditor.size.width ) * 2 - 1, - ( event.offsetY / store.state.matcapEditor.size.height ) * 2 + 1);
        raycaster.setFromCamera( pointer, this.camera );
        const hits = raycaster.intersectObjects( this.scene.children );
        const hit = hits[0];
        if(!hit)
            return;

            if(hits[0].object === sphere){

            }else if(hits[0].object === plane){
                this.arrowHelper.setDirection( new Vector3().subVectors(new Vector3(), hit.point).normalize() );
                this.arrowHelper.position.copy(hit.point);
                // raycaster.set(raycaster.ray.origin,)
            }
            const pointLight = new THREE.PointLight( 0xffffff, .5 );
            pointLight.position.x = hits[0].point.x;
            pointLight.position.y = hits[0].point.y;
            pointLight.position.z = hits[0].point.z + .1;
            pointLight.lookAt( 0, 0, 0 );
            console.log(pointLight);
            this.scene.add( pointLight );



            this.renderer.render(this.scene, cameraSnapshot);

            const screenVector = getScreenPosition(
                pointLight.position,
                this.camera,
                store.state.matcapEditor.size.width,
                store.state.matcapEditor.size.height
            );
            Events.emit('matcap:editor:light:added', {
                x: screenVector.x,
                y: screenVector.y,
                light : pointLight,
            });
            
            this.renderer.domElement.toBlob(this.onBlobReady.bind(this), 'image/png', 1.0);
    }

    onBlobReady(blob){
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        Events.emit('matcap:updateFromEditor', url);
        if(this.downloadMatcap){
            a.href = url;
            a.download = 'canvas.png';
            a.click();
        }
    }
}

export default Content;