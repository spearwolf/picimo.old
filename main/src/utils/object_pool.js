
export default class ObjectPool {

    constructor (factoryFunc) {
        this.objects = [];
        this.inUseCount = 0;
        this.setFactory(factoryFunc);
    }

    setFactory (func) {
        this.factory = func ? func : function () { return {} };
    }

    create () {
        let obj;

        if (this.inUseCount < this.objects.length) {
            obj = this.objects[this.inUseCount];
        } else {
            obj = this.factory();
            this.objects.push(obj);
        }

        ++this.inUseCount;

        return obj;
    }

    releaseAll () {
        this.inUseCount = 0;
    }

    destroyAll () {
        this.inUseCount = 0;
        this.objects.length = 0;
    }

}

