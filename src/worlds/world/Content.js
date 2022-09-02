import * as THREE from 'three';
import Events from '../../commons/Events';
import World from './World';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DoubleSide, MeshMatcapMaterial } from 'three';
import store from '../../store';



const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 256, 32);
const torusKnotMaterial = new THREE.MeshMatcapMaterial();
const standardMat = new THREE.MeshStandardMaterial();
const standardLoader = new THREE.TextureLoader();
standardMat.map = standardLoader;
const matcapLoader = new THREE.TextureLoader();
torusKnotMaterial.matcap = matcapLoader;
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);

class Content{
    constructor(){
        this.scene = World.getInstance().scene;
        torusKnot.rotation.y = 90 * (180 / Math.PI )
        this.scene.add(torusKnot);

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        this.scene.add( directionalLight );
        
        
        Events.on('matcap:updateFromEditor', this.onmatcapUpdated.bind(this));
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('./draco/gltf/');
        // this.dracoLoader.setDecoderConfig({ type: 'js' });
        this.loader.setDRACOLoader(this.dracoLoader);
        this.loader.load( './objects.gltf', this.onLoad.bind(this));

        Events.on('object:visible:update', this.onObjectVisibilityUpdated.bind(this));
    }

    onObjectVisibilityUpdated() {
        torusKnot.visible = store.state.models.visible.torusKnot;
        if(this.models.length){
            this.models.forEach(model => {
                model.visible = store.state.models.visible.spheres;
            });
        }
    }

    onLoad(gltf) {
        this.models = [];
        gltf.scene.traverse( (child) => {
            if(child.isGroup){

            }else if(child.isMesh){
                // console.log(child.material);
                // child.material = new THREE.MeshStandardMaterial();
                // child.material.map = matcapLoader;

                let matCloned = child.material.clone();
                // console.log(matCloned);
                child.material = torusKnotMaterial.clone();
                console.log(child.material);
                child.material.map = matCloned.map;
                child.material.flatShading = true;
                child.material.normalMap = matCloned.normalMap;
                child.customUniforms = {
                    uRoughnessMap : {value: matCloned.roughnessMap},
                    uMetalnessMap : {value: matCloned.metalnessMap},
                    uPower : {value: store.state.models.power},
                };
                child.material.onBeforeCompile = (shader) => {
                    // console.log(shader);
                    shader.uniforms = Object.assign(shader.uniforms, child.customUniforms);
                    shader.fragmentShader = shader.fragmentShader.replace(
                        'uniform vec3 diffuse;',
                        `
                        uniform vec3 diffuse;
                        uniform sampler2D uRoughnessMap;
                        uniform float uPower;
                        `
                    );
                    shader.fragmentShader = shader.fragmentShader.replace(
                        'vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;',
                        `
                        vec4 roughnessMap = texture2D( uRoughnessMap, vUv );
                        vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb  * roughnessMap.g;
                        // outgoingLight = diffuseColor.rgb * (matcapColor.rgb * vec3(roughnessMap.g) * 3.);
                        outgoingLight = diffuseColor.rgb *(matcapColor.rgb * vec3(roughnessMap.g))* uPower;
                        `
                    );
                };
                // child.material.matcap = matcapLoader;
                child.visible = false;
                this.models.push(child);
            }
        });
        this.scene.add(gltf.scene);

        Events.on('object:power:update', this.onObjectPowerUpdate.bind(this));
    }

    onObjectPowerUpdate() {
        if(this.models.length){
            this.models.forEach(model => {
                model.customUniforms.uPower.value = store.state.models.power;
                console.log(model.customUniforms.uPower.value);
            });
        }
    }
    
    onmatcapUpdated(matcapURL){
        matcapLoader.load(matcapURL, (texture)=>{
            torusKnot.material.matcap = texture;
            torusKnot.material.needsUpdate = true;
            // customUniforms.uMatcap.value = texture;
            if(this.models.length){
                this.models.forEach(model => {
                    model.material.matcap = texture;
                    // model.material.map = texture;
                    // console.log(model);
                    // model.material.lightMap = texture;
                    model.material.needsUpdate  = true;
                });
            }
        });
    }

    update(clock){
        // torusKnot.rotation.x += 0.01;
        // torusKnot.rotation.y += 0.01;
        // torusKnot.rotation.z += 0.01;
    }
}

export default Content;