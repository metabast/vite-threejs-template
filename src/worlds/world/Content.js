import * as THREE from 'three';

// SHADERS
import vertexShader from './shaders/default-vertex.glsl';
import fragmentShader from './shaders/default-fragment.glsl';

const matShader = new THREE.ShaderMaterial({
    uniforms:{
        uTime: {value: 1.0}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // transparent: true,
    side: THREE.DoubleSide,
})

const geometry = new THREE.PlaneGeometry(1, 1);
const mesh = new THREE.Mesh(geometry, matShader);
mesh.position.x = -.51;

// SHADERS
import vertexRawShader from './shaders/raw-vertex.glsl';
import fragmentRawShader from './shaders/raw-fragment.glsl';

const matRawShader = new THREE.RawShaderMaterial({
    vertexShader: vertexRawShader,
    fragmentShader: fragmentRawShader,
    uniforms:{
        uTime: {value: 1.0}
    },
    transparent: false,
    side: THREE.DoubleSide,
})

const geometryRaw = new THREE.PlaneGeometry(1, 1);
const meshRaw = new THREE.Mesh(geometryRaw, matRawShader);
meshRaw.position.x = .51;

function Content(scene){
	scene.add(mesh);
    scene.add(meshRaw);
	return {
		update(clock){
            matShader.uniforms.uTime.value = clock.getElapsedTime();
            matRawShader.uniforms.uTime.value = clock.getElapsedTime();
		}
	}
}

export default Content;