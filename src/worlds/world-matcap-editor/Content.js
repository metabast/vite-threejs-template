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
import LightModel from './LightModel';
import { toRaw } from 'vue';
import LightFabric from '../../components/LightFabric';

const storeCreate = store.state.matcapEditor.create;
const storeMaterial = store.state.matcapEditor.material;

const cameraSnapshot = new THREE.OrthographicCamera( -halfSize, halfSize, halfSize, -halfSize, .5, 200 );
cameraSnapshot.position.set( 0, 0, 1 );

const planeGeometry = new THREE.PlaneGeometry(2,2);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
planeMaterial.transparent = true;
planeMaterial.opacity = 0;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const widthSegments = 256;
const heightSegments = widthSegments / (4 / 3);

const sphereRenderGeometry = new THREE.SphereGeometry(0.3, widthSegments, heightSegments);
const sphereRenderMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff});
sphereRenderMaterial.roughness = storeMaterial.roughness;
sphereRenderMaterial.metalness = storeMaterial.metalness;
const sphereRender = new THREE.Mesh(sphereRenderGeometry, sphereRenderMaterial);

const sphereNormalGeometry = new THREE.SphereGeometry(0.4, widthSegments, heightSegments);
const sphereNormalMaterial = new THREE.MeshNormalMaterial    ({opacity:0, transparent:true});
const sphereNormal = new THREE.Mesh(sphereNormalGeometry, sphereNormalMaterial);

const meshesIntersectable = [plane, sphereRender, sphereNormal];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();




class Content{
    constructor(){
        this.world = World.getInstance();
        this.renderer = World.getInstance().renderer;
        this.scene = World.getInstance().scene;
        this.camera = World.getInstance().camera;

        sphereRender.geometry.computeBoundsTree();
        sphereNormal.geometry.computeBoundsTree();

        this.scene.add(plane);
        this.scene.add(sphereRender);
        this.scene.add(sphereNormal);

        this.ambiantLight = new THREE.AmbientLight( 0x000000 );
		this.ambiantLight.intensity = store.state.matcapEditor.ambiant.intensity;
		this.ambiantLight.color = store.state.matcapEditor.ambiant.color;
		this.scene.add( this.ambiantLight );

		Events.on('matcap:ambiant:update', () => {
			this.ambiantLight.intensity = store.state.matcapEditor.ambiant.intensity;
			this.ambiantLight.color = store.state.matcapEditor.ambiant.color;
            this.snapshot();
		});

        this.arrowHelper = new THREE.ArrowHelper( new Vector3(), new Vector3(), this.length, '#ff0000' );
        this.scene.add( this.arrowHelper );

        this.world.canvas.addEventListener( 'mouseover', this.onMouseOver.bind(this) );
        this.world.canvas.addEventListener( 'mouseout', this.onMouseOut.bind(this) );
        this.pointerDownListener = this.onPointerDown.bind(this);
        this.pointerUpListener = this.onPointerUp.bind(this);
        this.pointerMoveListener = this.onPointerMove.bind(this);

        Events.on('matcap:snapshot', this.snapshot.bind(this));
        Events.on('matcap:export:png', this.exportPNG.bind(this));
        Events.on('matcap:light:update:distance', this.updateLightDistance.bind(this));
        Events.on('matcap:light:delete', this.deleteLight.bind(this));
        Events.on('matcap:light:startMoving', (lightModel)=>{
            this.currentLightModel = lightModel;
        });
        Events.on('light:stopMoving', (lightModel)=>{
            this.currentLightModel = null;
            this.snapshot();
        });
        this.world.canvas.addEventListener( 'pointerup', this.pointerUpListener );

        this.sphereRenderMaterial = sphereRenderMaterial;
        Events.emit('matcap:content:ready', this);
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
        this.arrowHelper.visible = true;
        this.world.canvas.addEventListener( 'pointermove', this.pointerMoveListener );
        this.world.canvas.addEventListener( 'pointerdown', this.pointerDownListener );
    }

    onPointerUp(event){
        store.state.matcapEditor.isUILightVisible = true;
        this.currentLightModel = null;
        this.snapshot();
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

        if(this.currentLightModel) {
            const positionOnSphere = this.hitSphere.point.clone();
            this.lightPosition = positionOnSphere.clone();
            this.lightPosition.add( this.hitSphere.face.normal.clone().multiplyScalar(this.currentLightModel.distance) );
            this.currentLightModel.light.position.x = this.lightPosition.x;
            this.currentLightModel.light.position.y = this.lightPosition.y;
            if(store.state.matcapEditor.create.front)
                this.currentLightModel.light.position.z = this.lightPosition.z;
            else
                this.currentLightModel.light.position.z = -this.lightPosition.z;
            
            this.currentLightModel.update();

            const screenPosition = getScreenPosition(
                positionOnSphere.clone().add(this.hitSphere.face.normal.clone().multiplyScalar(.1)),
                this.camera,
                store.state.matcapEditor.size.width,
                store.state.matcapEditor.size.height
            );
            this.currentLightModel.screenPosition = screenPosition;
            this.currentLightModel.positionOnSphere = positionOnSphere;
            this.currentLightModel.sphereFaceNormal = this.hitSphere.face.normal.clone();
        }
        
    }

    onMouseOut(event){
        this.arrowHelper.visible = false;
        this.world.canvas.removeEventListener( 'pointermove', this.pointerMoveListener );
        this.world.canvas.removeEventListener( 'pointerdown', this.pointerDownListener );
    }



    onPointerDown(event){

        if(!this.hitSphere)
            return;
        
        const positionOnSphere = this.hitSphere.point.clone();
        
        this.lightPosition = this.hitSphere.point.clone();
        this.lightPosition.add( this.hitSphere.face.normal.clone().multiplyScalar(storeCreate.distance) );

        const instanceOfLight = LightFabric.getLightInstance(storeCreate.type);
        instanceOfLight.position.x = this.lightPosition.x;
        instanceOfLight.position.y = this.lightPosition.y;
        if(store.state.matcapEditor.create.front)
            instanceOfLight.position.z = this.lightPosition.z;
        else
            instanceOfLight.position.z = -this.lightPosition.z;
        
        this.scene.add( instanceOfLight );
        if(storeCreate.type === 'Spot')
            this.scene.add( instanceOfLight.target );

        
        const screenPosition = getScreenPosition(
            positionOnSphere.clone().add(this.hitSphere.face.normal.clone().multiplyScalar(.1)),
            this.camera,
            store.state.matcapEditor.size.width,
            store.state.matcapEditor.size.height
        );

        const lightModel = new LightModel()
        lightModel.light = instanceOfLight;
        lightModel.screenPosition = screenPosition;
        lightModel.positionOnSphere = positionOnSphere;
        lightModel.sphereFaceNormal = this.hitSphere.face.normal.clone();
        lightModel.distance = Number(storeCreate.distance);
        
        Events.emit('matcap:editor:light:added', lightModel);
        
        this.snapshot();
    }

    updateLightDistance(lightModel){
        const lightPosition = lightModel.positionOnSphere.clone();
        lightPosition.add( lightModel.sphereFaceNormal.clone().multiplyScalar(lightModel.distance) );
        lightModel.light.position.x = lightPosition.x;
        lightModel.light.position.y = lightPosition.y;
        if(store.state.matcapEditor.create.front)
            lightModel.light.position.z = lightPosition.z;
        else
            lightModel.light.position.z = -lightPosition.z;
        
        this.snapshot();
    }

    deleteLight(lightModel){
        this.scene.remove(toRaw(lightModel.light));
        this.snapshot();
    }
    
    snapshot() {
        const arrowHelperVisibleState = this.arrowHelper.visible;
        this.arrowHelper.visible = false;
        this.renderer.render(this.scene, cameraSnapshot);
        this.arrowHelper.visible = arrowHelperVisibleState;
        this.renderer.domElement.toBlob(this.onBlobReady.bind(this), 'image/png', 1.0);
    }

    onBlobReady(blob){
        const url = URL.createObjectURL(blob);
        this.blobURL = url;
        Events.emit('matcap:updateFromEditor', url);
    }

    exportPNG(){
        if(!this.blobURL)
            return;
        const a = document.createElement('a');
        a.href = this.blobURL;
        a.download = 'matcap.png';
        a.click();
    }

    static getInstance(){
        if(!Content.instance){
            Content.instance = new Content();
        }
        return Content.instance;
    }
}

export default Content;