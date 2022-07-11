import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
import Stats from '../../commons/Stats.js';

class World{
	constructor() {
	}

	init() {
		this.stats = Stats.getStats();

		this.canvas = document.querySelector('canvas.webgl2');
		this.scene = new THREE.Scene();
		this.halfSize = .5;
		this.camera = new THREE.OrthographicCamera( -this.halfSize, this.halfSize, this.halfSize, -this.halfSize, .5, 200 );
		// scene.background = new THREE.Color(0xffffff);
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});
		this.renderer.setSize( 200, 200 );

		this.camera.position.set( 0, 0, 1 );

		this.clock = new THREE.Clock();

		this.content = new Content();

		this.tick();
	}

	tick() {
		this.content.update(this.clock);
		this.renderer.render(this.scene, this.camera);
		this.stats.end();
		requestAnimationFrame(this.tick.bind(this));
	}


	static getInstance() {
		if (!World.instance) {
			World.instance = new World();
		}
		return World.instance;
	}
}
export default World;

function World2(){

		const canvas = document.querySelector('canvas.webgl2');
		const scene = new THREE.Scene();
		const size = .5;
		const camera = new THREE.OrthographicCamera( -size, size, size, -size, .5, 200 );
		
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
		});
		renderer.setSize( 200,200 );

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
