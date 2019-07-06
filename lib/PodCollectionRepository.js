const _ = require('underscore');
const Pod = require('./Pod');
const podStatusList = require('../podStatusList.json');

module.exports = class PodCollectionRepository {

    constructor() {
        this.podCollection = [];
    }

    addPod(ID) {
        const splitedID = ID.split('-');
        const manifestID = splitedID[0];
        const podID = splitedID[1];
        const podStatus =  podStatusList[manifestID];

        if(!podStatus) {
            throw new Error('This is unknown Pod!');
        }

        const recentPod = this.getPod(manifestID);

        let pod;
        if(recentPod.length) {
            const latestMaxNum = _.max(recentPod, (pod) => { return pod.num; }).num;
            pod = new Pod(manifestID, podID, latestMaxNum + 1, podStatus.name, podStatus.port);
        }else {
            pod = new Pod(manifestID, podID, 1, podStatus.name, podStatus.port);
        }

        return this.podCollection.push(pod);
    }

    getPod(manifestID, num) {
        if(num) {
            return _.find(this.podCollection, (pod) => { return pod.manifest == manifestID && pod.num == num });
        } else {
            return _.filter(this.podCollection, (pod) => { return pod.manifest == manifestID });
        }
    }

    getPodbyID(manifestID, id) {
        return _.find(this.podCollection, (pod) => { return pod.manifest === manifestID && pod.id === id });
    }

    updatePod(manifestID, num, query) {
        const pod = this.getPod(manifestID, num);
        pod.port[query.port].data = query.data;
        return this.getPod(manifestID, num);
    }

    deletePods() {
        this.podCollection = [];
        return true;
    }
};
