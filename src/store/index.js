import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            matcapEditor: {
                size:{
                    width: 200,
                    height: 200,
                },
                create : {
                    front: true,
                    lightType: 'Point',
                    color: 0xFFFFFF,
                    intensity: 1,
                    distance:1,
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