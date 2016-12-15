const ClassifierObject = require("./../objects/Classifier.js");

class Classifier {

    constructor(client, options){
        this.client = client;
    }

    getInstance(id, customer){
        return new ClassifierObject(this, id, customer);
    }

    info(id, customer){

        return this.client.request("GET", `/api/v2/classifier/${id}/${customer}`).then(({status, body}) => {

            if(status === 200){
                return body;
            }

            throw new Error(body.error);
        });
    }

    create(customer){

        const body = {
            customer
        };

        return this.client.request("POST", "/api/v2/classifier", body).then(({status, body}) => {

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

        return this.client.request("PUT", "/api/v2/classifier", body).then(({status, body}) => {

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

        return this.client.request("PATCH", "/api/v2/classifier", body).then(({status, body}) => {

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

        return this.client.request("DELETE", "/api/v2/classifier", body).then(({status, body}) => {

            if(status === 202){
                return body.id;
            }

            throw new Error(body.error);
        });
    }
}

module.exports = Classifier;