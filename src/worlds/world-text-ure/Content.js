import * as THREE from 'three';

import canvasTxt from 'canvas-txt'

import ProjectedMaterial from './ProjectdMaterial'

import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import World from './World';

const data = {
    context: null,
    cameraProjector: null,
    canvasTexture: null,
    projectedMaterial: null,
    text: 'Hello World',
    fontSize: 128,
    sizes: {
        width: 1024,
        height: 1024,
        marginLeft: 10,
        marginTop: 10,
    },
};
let initialized = false;
const Content = {
    init() {
        if (initialized) return;
        initialized = true;

        World.camera.position.y = 2;
        World.camera.position.z = 4;
        World.camera.lookAt(0, 4, 0);

        data.cameraProjector = new THREE.PerspectiveCamera(20, 1, .1, 2);
        data.cameraProjector.position.set(0, 2, 4);

        data.helper = new THREE.CameraHelper(data.cameraProjector);
        World.scene.add(data.helper);

        const canvas = document.querySelector('canvas#myCanvas');
        canvas.width = data.sizes.width;
        canvas.height = data.sizes.height;
        data.ctx = canvas.getContext('2d');

        canvasTxt.fontSize = data.fontSize;

        data.canvasTexture = new THREE.CanvasTexture(data.ctx.canvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearMipmapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, 2);
        data.canvasTexture.magFilter = THREE.LinearFilter;
        data.canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        // const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        const meshMaterial = new THREE.MeshBasicMaterial();

        data.projectedMaterial = new ProjectedMaterial({
            camera: data.cameraProjector, // the camera that acts as a projector
            texture: data.canvasTexture, // the texture being projected
            textureScale: 1., // scale down the texture a bit
            textureOffset: new THREE.Vector2(0), // you can translate the texture if you want
            cover: false, // enable background-size: cover behaviour, by default it's like background-size: contain
            // color: '#ccc', // the color of the object if it's not projected on
            // roughness: 0, // you can pass any other option that belongs to MeshPhysicalMaterial
        })

        data.projectedMaterial.onBeforeCompile = (shader) => {
            console.log(shader);
        };

        // meshMaterial.color = new THREE.Color(0x00ff00);
        // meshMaterial.map = texture;

        const mesh = new THREE.Mesh(geometry, data.projectedMaterial);
        World.scene.add(mesh);





        const light = new THREE.HemisphereLight('#FFF', '#FFF', 1);
        World.scene.add(light);
        // data.cameraProjector.lookAt(0, 0, 0);
        // data.cameraProjector.updateWorldMatrix(true, true)

        // data.cameraProjector.updateProjectionMatrix();
        // data.cameraProjector.updateMatrixWorld();
        // data.cameraProjector.updateWorldMatrix();

        data.projectedMaterial.project(mesh);

        Content.draw();

        Content.loadObject();
    },

    loadObject() {
        data.loader = new GLTFLoader();
        data.dracoLoader = new DRACOLoader();
        data.dracoLoader.setDecoderPath('./draco/gltf/');
        data.loader.setDRACOLoader(data.dracoLoader);
        data.loader.load('./models/urne1.gltf', Content.onLoad);


    },

    onLoad: (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.name === 'BezierCurve001') {
                data.mesh = child;
                const cloneMat = child.material.clone();
                // child.material = data.projectedMaterial;
                // console.log(child.material);
                // child.material.map = cloneMat.map;
                data.projectedMaterial = new ProjectedMaterial({
                    camera: data.cameraProjector, // the camera that acts as a projector
                    texture: data.canvasTexture, // the texture being projected
                    textureScale: 1., // scale down the texture a bit
                    textureOffset: new THREE.Vector2(0), // you can translate the texture if you want
                    cover: false, // enable background-size: cover behaviour, by default it's like background-size: contain
                    map: cloneMat.map,
                    color: '#ffffff', // the color of the object if it's not projected on
                    // roughness: 0, // you can pass any other option that belongs to MeshPhysicalMaterial
                })
                child.material = data.projectedMaterial;
                console.log(data.projectedMaterial);
                data.projectedMaterial.project(child);
                // child.material.needsUpdate = true;
            }
        });
        World.scene.add(gltf.scene);
    },

    addText(text) {
        data.text += ` ${text} `;
        Content.draw();
    },

    set fontSize(value) {
        canvasTxt.fontSize = value;
        Content.draw();
    },

    get fontSize() {
        return canvasTxt.fontSize;
    },

    get cameraProjector() {
        return data.cameraProjector;
    },

    moveCameraProjector(x, y, z) {
        data.cameraProjector.position.set(x, y, z);
        data.projectedMaterial.project(data.mesh);
        data.helper.update();
    },

    draw() {
        data.ctx.clearRect(0, 0, data.sizes.width, data.sizes.height);

        data.ctx.fillStyle = '#000000';
        data.ctx.fillRect(0, 0, data.sizes.width, data.sizes.height);

        data.ctx.fillStyle = '#ffffff'
        canvasTxt.drawText(
            data.ctx,
            data.text,
            data.sizes.marginLeft,
            data.sizes.marginTop,
            data.sizes.width - data.sizes.marginLeft * 2,
            data.sizes.height - data.sizes.marginTop * 2
        );
        data.canvasTexture.needsUpdate = true;
    },

    update(clock) {}
}
window.content = Content;
export default Content;