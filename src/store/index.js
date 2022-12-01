import { Color, Vector3 } from 'three';
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            currentMesh: {
                position: new Vector3(0, 0, 0),
                scale: new Vector3(1, 1, 1),
            }
        };
    },
    mutations: {

    }
});

export default store;