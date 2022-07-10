import {createNanoEvents} from 'nanoevents';
class Events {
    constructor() {
        this.emitter = createNanoEvents();
    }

    static on (event, callback) {
        return Events.getInstance().emitter.on(event, callback);
    }

    static emit (event, data) {
        Events.getInstance().emitter.emit(event, data);
    }

    static getInstance() {
        if (!Events.instance) {
            Events.instance = new Events();
        }
        return Events.instance;
    }
}

export default Events;