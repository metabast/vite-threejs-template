import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import Content from './Content.js';
import Resize from '../../commons/Resize.js'
//import stats.js
import Stats from 'stats.js';

const data = {
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    content: null,
    stats: null,
    clock: null,
};

function animate() {
    data.stats.begin();
    data.control.update();
    data.content.update(data.clock);
    data.renderer.render(data.scene, data.camera);
    data.stats.end();
    requestAnimationFrame(animate);
}

let initialized = false;
const World = {

    init() {
        if (initialized) return;
        initialized = true;

        data.stats = new Stats();
        data.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(data.stats.dom);

        data.canvas = document.querySelector('canvas.webgl');
        data.scene = new THREE.Scene();

        data.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        data.renderer = new THREE.WebGLRenderer({
            canvas: data.canvas,
            antialias: true,
        });
        data.renderer.setSize(window.innerWidth, window.innerHeight);

        data.control = new OrbitControls(data.camera, data.renderer.domElement)
        data.control.enableDamping = true;
        data.camera.position.set(0, 0, 2);

        data.clock = new THREE.Clock();

        data.content = Content;
        Content.init();

        Resize.getInstance()
            .updateCanvas(data.canvas)
            .updateCamera(data.camera)
            .updateRenderer(data.renderer);

        animate();
    },

    get scene() {
        return data.scene;
    },

    get camera() {
        return data.camera;
    },

    get renderer() {
        return data.renderer;
    }
}

export default World;