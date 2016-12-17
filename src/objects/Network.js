class Network {

    constructor(slash, id, customer){
        this._network = slash;
        this.id = id;
        this.customer = customer;
    }

    info(){
        return this._network.info(this.id, this.customer);
    }

    train(data){
        return this._network.train(this.id, data, this.customer);
    }

    stack(data){
        return this._network.stack(this.id, data, this.customer);
    }

    runStack(){
        return this._network.runStack(this.id, this.customer);
    }

    process(input){
        return this._network.process(this.id, input, this.customer);
    }

    remove(){
        return this._network.remove(this.id, this.customer);
    }
}

module.exports = Network;