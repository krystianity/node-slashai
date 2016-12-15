class Classifier {

    constructor(slash, id, customer){
        this._classifier = slash;
        this.id = id;
        this.customer = customer;
    }

    info(){
        return this._classifier.info(this.id, this.customer);
    }

    train(data){
        return this._classifier.train(this.id, data, this.customer);
    }

    process(input){
        return this._classifier.process(this.id, input, this.customer);
    }

    remove(){
        return this._classifier.remove(this.id, this.customer);
    }
}

module.exports = Classifier;