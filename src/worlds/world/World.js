import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
	
export default function World(){

		const canvas = document.querySelector('canvas.webgl');
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
		});
		renderer.setSize( window.innerWidth, window.innerHeight );

		const control = new OrbitControls(camera, renderer.domElement)
		control.enableDamping = true;
		camera.position.set( 0, 0, 2 );

		const clock = new THREE.Clock();

		// 
		const content = new Content(scene);

		Resize.getInstance()
			.updateCanvas(canvas)
			.updateCamera(camera)
			.updateRenderer(renderer);	


		function animate(){
			control.update();
			content.update(clock);
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}
		animate();
}
