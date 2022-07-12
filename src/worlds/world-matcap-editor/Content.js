import * as THREE from 'three';
import Events from '../../commons/Events';
const size = .28;
// SHADERS
import vertexShader from './shaders/default-vertex.glsl';
import fragmentShader from './shaders/default-fragment.glsl';
import World from './World';

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

const light = new THREE.PointLight( 0xffffff, 0 );
// light.position.set( 0, 0, 0 );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


class Content{
    constructor(){
        this.renderer = World.getInstance().renderer;
        this.scene = World.getInstance().scene;
        this.camera = World.getInstance().camera;

        this.scene.add(plane);
        this.scene.add(sphere);
        this.scene.add(light);

        Events.on('focus:changed', this.onFocusChanged.bind(this));

        document.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    }

    update(clock){
    }

    onFocusChanged(focusName){
        this.isFocused = focusName === 'world-matcap-editor';
        console.log("this.isFocused", this.isFocused);
        if(this.isFocused){
            this.camera.add(cameraSnapshot);
        }else{
            this.camera.remove(cameraSnapshot);
        }
    }

    onPointerDown(event){
        if(!this.isFocused) return;

        pointer.set(( event.offsetX / 200 ) * 2 - 1, - ( event.offsetY / 200 ) * 2 + 1);
        raycaster.setFromCamera( pointer, this.camera );
        const intersects = raycaster.intersectObjects( this.scene.children );
        if(intersects.length > 0){

            const pointLight = new THREE.PointLight( 0xffffff, .5 );
            pointLight.position.x = intersects[0].point.x;
            pointLight.position.y = intersects[0].point.y;
            pointLight.position.z = intersects[0].point.z + .1;
            this.scene.add( pointLight );

            // plane.material.opacity = 1;
            this.renderer.render(this.scene, cameraSnapshot);
            // plane.material.opacity = 0;
            // console.log(pointLight.position.clone());

            const vectorFor2d = pointLight.position.clone();
            vectorFor2d.z = 0;
            vectorFor2d.unproject(this.camera);
            const screenVector = vectorFor2d.multiplyScalar(2).addScalar(.5).multiplyScalar(200);
            Events.emit('matcap:editor:light:added', {
                x: screenVector.x,
                y: screenVector.y,
                light : pointLight,
            });
            
            this.renderer.domElement.toBlob(this.onBlobReady.bind(this), 'image/png', 1.0);
        }
        // console.log(intersects);
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


function Content2(renderer, scene, camera){
    scene.add(plane);
    scene.add(sphere);
    scene.add( light );

    const onPointerDown = (event) => {
        pointer.set(( event.offsetX / 200 ) * 2 - 1, - ( event.offsetY / 200 ) * 2 + 1);
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( scene.children );
        if(intersects.length > 0){
            const light2 = new THREE.PointLight( 0xffffff, .5 );
            light2.position.x = intersects[0].point.x;
            light2.position.y = intersects[0].point.y;
            light2.position.z = intersects[0].point.z + .1;
            scene.add( light2 );

            plane.material.opacity = 1;
            renderer.render(scene, cameraSnapshot);
            plane.material.opacity = 0;
            
            renderer.domElement.toBlob(function(blob){
                var a = document.createElement('a');
                var url = URL.createObjectURL(blob);
                Events.emit('matcap:updateFromEditor', url);
                // a.href = url;
                // a.download = 'canvas.png';
                // a.click();
            }, 'image/png', 1.0);

            // var canvas2 = document.querySelector('canvas.webgl2');
            // var ctx = canvas2.getContext('2d');
            console.log(renderer);
        }
        console.log(intersects);
    }
    
    document.addEventListener( 'pointerdown', onPointerDown );

	return {
		update(clock){
		}
	}
}

export default Content;