import { PointLight, RectAreaLight, SpotLight } from "three";
import store from "../store";
const storeCreate = store.state.matcapEditor.create;
class LightFabric{

    constructor(){
        if(!LightFabric.instance){
            LightFabric.instance = this;
        }else{
            throw new Error("LightFabric is a singleton class");
        }
    }

    static getLightInstance(type){
        if(!type) type = storeCreate.lightType;
        switch(type){
            case 'Point':
                const pointLight = new PointLight(Number(storeCreate.color), storeCreate.intensity);
                return pointLight;
                break;
            case 'Area':
                const areaLight = new RectAreaLight(Number(storeCreate.color), storeCreate.intensity, storeCreate.area.width, storeCreate.area.height);
                return areaLight;
                break;
            case 'Spot':
                const spotLight = new SpotLight(Number(storeCreate.color), storeCreate.intensity);
                return spotLight;
                break;

            default:
                throw new Error("Light type not supported");
        }
    }

    static getInstance(){
        if(!LightFabric.instance){
            new LightFabric();
        }
        return LightFabric.instance;
    }
}

export default LightFabric;