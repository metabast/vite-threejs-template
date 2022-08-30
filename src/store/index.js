import { Color } from "three";
import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            matcapEditor: {
                sizes: {
                    view: 200,
                    exportDefault: 256,
                    exportRatios: [.5, 1, 2, 4],
                    exportRatio: 1,
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