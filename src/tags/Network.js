const NetworkObject = require("./../objects/Network.js");

const TYPES = {
    PERCEPTRON: "perceptron",
    DEEP: "deep",
    LSTM: "lstm",
    HOPFIELD: "hopfield"
};

class Network {

    constructor(client, options){
        this.client = client;
        this.TYPES = TYPES;
    }

    getInstance(id, customer){
        return new NetworkObject(this, id, customer);
    }

    info(id, customer){

        return this.client.request("GET", `/api/v2/nn/${id}/${customer}`).then(({status, body}) => {

            if(status === 200){
                return body;
            }

            throw new Error(body.error);
        });
    }

    createPerceptron(features = 3, units = 2, outputs = 1, customer){

        const body = {
            customer: customer,
            features: features,
            units: units,
            outputs: outputs,
            networkType: TYPES.PERCEPTRON
        };

        return this.create(body);
    }

    createDeep(features = 3, units = [3,3,3], outputs = 2, customer){

        const body = {
            customer: customer,
            features: features,
            units: units,
            outputs: outputs,
            networkType: TYPES.DEEP
        };

        return this.create(body);
    }

    createLSTM(features = 3, units = [3,3,3], outputs = 1, customer){

        const body = {
            customer: customer,
            features: features,
            units: units,
            outputs: outputs,
            networkType: TYPES.LSTM
        };

        return this.create(body);
    }

    createHopfield(features = 3, units = 2, outputs = 1, customer){
        throw new Error("not implemented yet.");
    }

    create(body){

        return this.client.request("POST", "/api/v2/nn", body).then(({status, body}) => {

            if(status === 202){
                return body.id;
            }

            throw new Error(body.error);
        });
    }

    train(id, data, customer){

        const body = {
            classifierId: id,
            data: data,
            customer: customer
        };

        return this.client.request("PUT", "/api/v2/nn", body).then(({status, body}) => {

            if(status === 202){
                return body.id;
            }

            throw new Error(body.error);
        });
    }

    process(id, input, customer){

        const body = {
            classifierId: id,
            customer: customer,
            input: input
        };

        return this.client.request("PATCH", "/api/v2/nn", body).then(({status, body}) => {

            if(status === 200){
                return body;
            }

            throw new Error(body.error);
        });
    }

    remove(id, customer){

        const body = {
            classifierId: id,
            customer: customer
        };

        return this.client.request("DELETE", "/api/v2/nn", body).then(({status, body}) => {

            if(status === 202){
                return body.id;
            }

            throw new Error(body.error);
        });
    }
}

module.exports = Network;