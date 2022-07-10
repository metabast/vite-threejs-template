import * as THREE from 'three';
import Events from '../../commons/Events';

// SHADERS
import vertexShader from './shaders/default-vertex.glsl';
import fragmentShader from './shaders/default-fragment.glsl';

const planeGeometry = new THREE.PlaneGeometry(2,2);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
planeMaterial.transparent = true;
planeMaterial.opacity = 0;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);


const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const light = new THREE.PointLight( 0xffffff, 1, 10 );
light.position.set( 0, 0, 10 );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();




function Content(renderer, scene, camera){
    scene.add(plane);
    scene.add(sphere);
    scene.add( light );

    const onPointerDown = (event) => {
        pointer.set(( event.offsetX / 100 ) * 2 - 1, - ( event.offsetY / 100 ) * 2 + 1);
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( scene.children );
        if(intersects.length > 0){
            const light2 = new THREE.PointLight( 0xffffff, .5 );
            light2.position.x = intersects[0].point.x;
            light2.position.y = intersects[0].point.y;
            light2.position.z = intersects[0].point.z + .1;
            scene.add( light2 );

            renderer.render(scene, camera);
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