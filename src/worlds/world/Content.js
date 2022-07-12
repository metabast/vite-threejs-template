import * as THREE from 'three';
import Events from '../../commons/Events';
import World from './World';



const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 256, 32);
const torusKnotMaterial = new THREE.MeshMatcapMaterial();
const matcapLoader = new THREE.TextureLoader();
torusKnotMaterial.matcap = matcapLoader;
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);

class Content{
    constructor(){
        this.scene = World.getInstance().scene;
        this.scene.add(torusKnot);
        Events.on('matcap:updateFromEditor', this.onmatcapUpdated.bind(this));
    }
    
    onmatcapUpdated(matcapURL){
        matcapLoader.load(matcapURL, (texture)=>{
            torusKnot.material.matcap = texture;
        });
    }

    update(clock){
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
        torusKnot.rotation.z += 0.01;
    }
}

export default Content;