import * as THREE from 'three';

import canvasTxt from 'canvas-txt'

import ProjectedMaterial from 'three-projected-material'

import World from './World';

const data = {
    context: null,
    canvasTexture: null,
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

        const cameraProjector = new THREE.PerspectiveCamera(20, 1, .1, 2);
        cameraProjector.position.set(0, 2, 2);

        const helper = new THREE.CameraHelper(cameraProjector);
        World.scene.add(helper);

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

        const material = new ProjectedMaterial({
            camera: cameraProjector, // the camera that acts as a projector
            texture: data.canvasTexture, // the texture being projected
            textureScale: 1., // scale down the texture a bit
            textureOffset: new THREE.Vector2(0), // you can translate the texture if you want
            cover: false, // enable background-size: cover behaviour, by default it's like background-size: contain
            // color: '#ccc', // the color of the object if it's not projected on
            // roughness: 0, // you can pass any other option that belongs to MeshPhysicalMaterial
        })

        // meshMaterial.color = new THREE.Color(0x00ff00);
        // meshMaterial.map = texture;

        const mesh = new THREE.Mesh(geometry, material);
        World.scene.add(mesh);





        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        World.scene.add(light);
        cameraProjector.lookAt(0, 0, 0);
        cameraProjector.updateWorldMatrix(true, true)

        cameraProjector.updateProjectionMatrix();
        cameraProjector.updateMatrixWorld();
        cameraProjector.updateWorldMatrix();

        material.project(mesh);

        Content.draw();
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