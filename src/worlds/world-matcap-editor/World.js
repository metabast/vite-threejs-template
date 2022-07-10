import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
	
export default function World(){

		const canvas = document.querySelector('canvas.webgl2');
		const scene = new THREE.Scene();
		const size = .5;
		const camera = new THREE.OrthographicCamera( -size, size, size, -size, .5, 200 );
		// scene.background = new THREE.Color(0xffffff);
		
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
		});
		renderer.setSize( 100,100 );
		console.log(renderer);

		// const control = new OrbitControls(camera, renderer.domElement)
		// control.enableDamping = true;
		camera.position.set( 0, 0, 1 );

		const clock = new THREE.Clock();

		// 
		const content = new Content(renderer, scene, camera);

		// Resize.getInstance()
		// 	.updateCanvas(canvas)
		// 	.updateCamera(camera)
		// 	.updateRenderer(renderer);	


		function animate(){
			// control.update();
			content.update(clock);
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}
		animate();
}
