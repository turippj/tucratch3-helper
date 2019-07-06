const events = require('events');
const serialPort = require('serialport');
const Readline = serialPort.parsers.Readline;
const eventEmitter = new events.EventEmitter();

module.exports = class ConnectionService {

    constructor(podCollection) {
        this.podCollection = podCollection;
    }

    async getPortList() {
        let portList = [];
        const ports = await serialPort.list();
        ports.forEach((port) => { portList.push({text: port.comName, value: port.comName}) });
        return portList;
    }

    initialize(comName, event) {
        this.serialPort = new serialPort(comName, {
                                            bandrate: 9600,
                                            dataBits: 8,
                                            parity: 'none',
                                            stopBits: 1,
                                            flowControl: false
                                        });
        this.parser = this.serialPort.pipe(new Readline({ delimiter: '\r\n' }));
        this.setStream(event);
        return true;
    }

    send(message) {
        return new Promise((resolve, reject) => {
            this.serialPort.write(message + '\n');
            eventEmitter.on('update', () => { resolve(this.podCollection); });
        })
    }

    getTpodList() {
        return this.serialPort.write('/\n');
    }

    setStream(event){
        this.parser.on('data', (res) => {
            const receivedData = JSON.parse(res);
            if(receivedData.status === 200) {
                if(receivedData.bridge) {
                    this.podCollection.deletePods();
                    for(let pod of receivedData.bridge) this.podCollection.addPod(pod);
                    event.sender.send('init', 'Init Sucssess!');
                }else {
                    const rawPodID = receivedData.id.split("-");
                    const manifestID = rawPodID[0];
                    const podID = rawPodID[1];
                    const pod = this.podCollection.getPodbyID(manifestID, podID);
                    this.podCollection.updatePod(manifestID, pod.num, {port: receivedData.port, data: receivedData.data});
                    eventEmitter.emit('update');
                }
            }else {
                throw new Error('Sending Message Error!');
            }
        });
    }
};
