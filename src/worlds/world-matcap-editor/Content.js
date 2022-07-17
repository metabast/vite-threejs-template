import * as THREE from 'three';
import Events from '../../commons/Events';
const halfSize = .30;
// SHADERS
import vertexShader from './shaders/default-vertex.glsl';
import fragmentShader from './shaders/default-fragment.glsl';
import World from './World';
import { getScreenPosition } from '../../commons/VectorHelper';
import store from '../../store';
import { Color, Vector3 } from 'three';

const cameraSnapshot = new THREE.OrthographicCamera( -halfSize, halfSize, halfSize, -halfSize, .5, 200 );
cameraSnapshot.position.set( 0, 0, 1 );

const planeGeometry = new THREE.PlaneGeometry(2,2);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
planeMaterial.transparent = true;
planeMaterial.opacity = 1;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);


const sphereRenderGeometry = new THREE.SphereGeometry(0.3, 64, 48);
const sphereRenderMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff});
const sphereRender = new THREE.Mesh(sphereRenderGeometry, sphereRenderMaterial);

const sphereNormalGeometry = new THREE.SphereGeometry(0.4, 64, 48);
const sphereNormalMaterial = new THREE.MeshNormalMaterial    ({color: 0xffffff, opacity:0, transparent:true});
const sphereNormal = new THREE.Mesh(sphereNormalGeometry, sphereNormalMaterial);

const meshesIntersectable = [plane, sphereRender, sphereNormal];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const storeCreate = store.state.matcapEditor.create;


class Content{
    constructor(){
        this.world = World.getInstance();
        this.renderer = World.getInstance().renderer;
        this.scene = World.getInstance().scene;
        this.camera = World.getInstance().camera;

        this.scene.add(plane);
        this.scene.add(sphereRender);
        this.scene.add(sphereNormal);

        this.arrowHelper = new THREE.ArrowHelper( new Vector3(), new Vector3(), this.length, '#ff0000' );
        this.scene.add( this.arrowHelper );

        this.world.canvas.addEventListener( 'mouseover', this.onMouseOver.bind(this) );
        this.world.canvas.addEventListener( 'mouseout', this.onMouseOut.bind(this) );
        this.pointerDownListener = this.onPointerDown.bind(this);
        this.pointerMoveListener = this.onPointerMove.bind(this);
        // this.world.canvas.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    }

    update(clock){
    }

    onFocusChanged(focusName){
        this.isFocused = focusName === 'world-matcap-editor';
        if(this.isFocused){
            this.camera.add(cameraSnapshot);
        }else{
            this.camera.remove(cameraSnapshot);
        }
    }

    onMouseOver(event){
        this.world.canvas.addEventListener( 'pointermove', this.pointerMoveListener );
        this.world.canvas.addEventListener( 'pointerdown', this.pointerDownListener );
    }

    onPointerMove(event){
        pointer.set(( event.offsetX / store.state.matcapEditor.size.width ) * 2 - 1, - ( event.offsetY / store.state.matcapEditor.size.height ) * 2 + 1);
        raycaster.setFromCamera( pointer, this.camera );
        const hits = raycaster.intersectObjects( meshesIntersectable );
        const hit = hits[0];
        if(!hit)
            return;
        
        let hits2, hit2;

        if(hit.object == sphereNormal){
            this.arrowHelper.setColor("#e5ff00")
            raycaster.set(hit.point, new Vector3().subVectors(new Vector3(), hit.point).normalize());
        }else if(hit.object === plane){
            this.arrowHelper.setColor("#00ffee")
            raycaster.set(hit.point, new Vector3().subVectors(new Vector3(), hit.point).normalize());
        }
        hits2 = raycaster.intersectObject(sphereRender);
        hit2 = hits2[0];
        
        if(!hit2)
            return;
        
        this.arrowHelper.setDirection( hit2.face.normal );
        this.arrowHelper.setLength( .1 );
        this.arrowHelper.position.copy(hit2.point);
        this.hitSphere = hit2;
    }

    onMouseOut(event){
        this.world.canvas.removeEventListener( 'pointermove', this.pointerMoveListener );
        this.world.canvas.removeEventListener( 'pointerdown', this.pointerDownListener );
    }



    onPointerDown(event){

        if(!this.hitSphere)
            return;
        
        this.pointOnSphere = this.hitSphere.point.clone();
        
        this.lightPosition = this.hitSphere.point.clone();
        console.log(store.state.matcapEditor.create.distance);
        this.lightPosition.add( this.hitSphere.face.normal.clone().multiplyScalar(storeCreate.distance) );
        const pointLight = new THREE.PointLight( Number(storeCreate.color), storeCreate.intensity );
        pointLight.position.x = this.lightPosition.x;
        pointLight.position.y = this.lightPosition.y;
        if(store.state.matcapEditor.create.front)
            pointLight.position.z = this.lightPosition.z;
            else
            pointLight.position.z = -this.lightPosition.z;
        
        pointLight.lookAt( 0, 0, 0 );
        // console.log(pointLight);
        this.scene.add( pointLight );

        this.arrowHelper.visible = false;
        this.renderer.render(this.scene, cameraSnapshot);
        this.arrowHelper.visible = true;
        
        const screenVector = getScreenPosition(
            this.pointOnSphere.add(this.hitSphere.face.normal.clone().multiplyScalar(.1)),
            this.camera,
            store.state.matcapEditor.size.width,
            store.state.matcapEditor.size.height
        );
        Events.emit('matcap:editor:light:added', {
            x: screenVector.x,
            y: screenVector.y,
            pointOnSphere: this.pointOnSphere,
            light : pointLight,
        });
        
        this.renderer.domElement.toBlob(this.onBlobReady.bind(this), 'image/png', 1.0);
    }

    onBlobReady(blob){
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        Events.emit('matcap:updateFromEditor', url);
        if(this.downloadMatcap){
            a.href = url;
            a.download = 'canvas.png';
            a.click();
        }
    }
}

export default Content;