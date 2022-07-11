import StatsJS from 'stats.js';

class Stats{
    constructor() {
        this.stats = new StatsJS();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }
    static getStats() {
        return Stats.getInstance().stats;
    }

    static getInstance() {
        if (!Stats.instance) {
            Stats.instance = new Stats();
        }
        return Stats.instance;
    }
}

export default Stats;