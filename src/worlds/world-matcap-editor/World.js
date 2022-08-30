import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVHVisualizer } from 'three-mesh-bvh';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
import Stats from '../../commons/Stats.js';
import store from '../../store';
import { BufferGeometry, Mesh } from 'three';
import Events from '../../commons/Events.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

class World{
	constructor() {
	}

	init() {
		this.stats = Stats.getStats();

		this.canvas = document.querySelector('canvas.webgl2');
		this.scene = new THREE.Scene();
		RectAreaLightUniformsLib.init();
		this.halfSize = .5;
		this.camera = new THREE.OrthographicCamera( -this.halfSize, this.halfSize, this.halfSize, -this.halfSize, .5, 200 );
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.setSize( store.state.matcapEditor.sizes.exportDefault, store.state.matcapEditor.sizes.exportDefault );
		this.renderer.setPixelRatio(1);

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