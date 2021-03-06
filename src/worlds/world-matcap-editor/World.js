import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
import Stats from '../../commons/Stats.js';
import store from '../../store';

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
		this.renderer.setSize( store.state.matcapEditor.size.width, store.state.matcapEditor.size.height );

		this.camera.position.set( 0, 0, 1 );

		this.clock = new THREE.Clock();

		this.content = Content.getInstance();

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