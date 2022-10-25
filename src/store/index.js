import { Color, Vector3 } from 'three';
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            position: new Vector3(0, 0, 0),
        };
    },
    mutations: {

    }
});

export default store;