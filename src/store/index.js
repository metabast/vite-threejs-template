import { Color } from "three";
import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            matcapEditor: {
                sizeExport:{
                    width: 256,
                    height: 256,
                },
                sizeView:{
                    width: 200,
                    height: 200,
                },
                ratio: 256/200,
                material:{
                    roughness: .25,
                    metalness: .5,
                },
                ambiant: {
                    color: new Color(),
                    intensity: 0.004,
                },
                create : {
                    front: true,
                    lightType: 'Point',
                    color: 0xFFFFFF,
                    intensity: 1,
                    distance:1,
                    area: {
                        width: 2,
                        height: 6,
                    }
                },
                lights : [],
                isUILightVisible: true,
            }
        };
    },
    mutations: {

    }
});

export default store;