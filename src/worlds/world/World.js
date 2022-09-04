import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
import Stats from '../../commons/Stats.js';
import { sRGBEncoding } from 'three';

class World{
	constructor() {
	}

	init() {
		this.stats = Stats.getStats();

		this.canvas = document.querySelector('canvas.webgl');
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		// scene.background = new THREE.Color(0xffffff);
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		// this.renderer.outputEncoding = sRGBEncoding;

		this.control = new OrbitControls(this.camera, this.renderer.domElement)
		this.control.enableDamping = true;
		this.camera.position.set( 0, 0, 4 );

		this.clock = new THREE.Clock();

		this.content = new Content(this.scene);

		Resize.getInstance()
			.updateCanvas(this.canvas)
			.updateCamera(this.camera)
			.updateRenderer(this.renderer);

		this.tick();
	}

	tick() {
		this.stats.begin();
		this.control.update();
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