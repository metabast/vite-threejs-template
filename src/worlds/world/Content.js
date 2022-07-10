import * as THREE from 'three';
import Events from '../../commons/Events';

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);
const torusKnotMaterial = new THREE.MeshMatcapMaterial();
torusKnotMaterial.matcap = new THREE.TextureLoader();
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);

function Content(scene){

    scene.add(torusKnot);
    Events.on('matcap:updateFromEditor', (matcapURL) => {
        torusKnot.material.matcap = new THREE.TextureLoader().load(matcapURL);
    });
	return {
		update(clock){

		}
	}
}

export default Content;