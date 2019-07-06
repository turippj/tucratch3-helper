
module.exports = class Pod {
    constructor(manifest, id, num, name, port) {
        this.manifest = manifest;
        this.name = name;
        this.port = port;
        this.id = id;
        this.num = num;
    }
}