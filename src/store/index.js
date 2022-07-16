import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            matcapEditor: {
                size:{
                    width: 200,
                    height: 200,
                }
            }
        };
    },
    mutations: {

    }
});

export default store;