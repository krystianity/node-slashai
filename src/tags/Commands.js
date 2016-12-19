const ClassifierObject = require("./../objects/Classifier.js");

class Commands {

    constructor(client, options){
        this.client = client;
    }

    getInstance(id, customer){
        return new ClassifierObject(this, id, customer);
    }

    info(id, customer){

        return this.client.request("GET", `/api/v2/classifier/${id}`).then(({status, body}) => {

            if(status === 200){
                return body;
            }

            throw new Error(body.error);
        });
    }

    create(data, filter, language, customer){

        const body = {
            customer,
            data,
            filter,
            language
        };

        return this.client.request("POST", "/api/v2/nlp/commands", body).then(({status, body}) => {

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

        return this.client.request("PATCH", "/api/v2/nlp/commands", body).then(({status, body}) => {

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

        return this.client.request("DELETE", "/api/v2/nlp/commands", body).then(({status, body}) => {

            if(status === 202){
                return body.id;
            }

            throw new Error(body.error);
        });
    }
}

module.exports = Commands;