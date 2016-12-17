const RestClient = require("./RestClient.js");

const Commands = require("./tags/Commands.js");
const NLP = require("./tags/NLP.js");
const Network = require("./tags/Network.js");
const Classifier = require("./tags/Classifier.js");

class SlashAI {

    constructor(options){

        if(typeof options !== "object"){
            throw new Error("options should be an object.");
        }

        this.options = options;
        this.client = new RestClient(options);

        this.commands = new Commands(this.client, options);
        this.nlp = new NLP(this.client, options);
        this.network = new Network(this.client, options);
        this.classifier = new Classifier(this.client, options);
    }

    status(id){
        return this.client.status(id);
    }

    await(id){
        return this.client.await(id);
    }

    alive(){
        return this.client.request("GET", "/api/v2/alive").then(response => {
            return response.status === 200;
        });
    }

    authcheck(){
        return this.client.request("GET", "/api/v2/authcheck").then(response => {
            return response.status === 200;
        });
    }

    access(){
        return this.client.request("GET", "/api/v2/access").then(response => {
            if(response.status === 200){
                return response.body;
            } else {
                throw new Error(response.body.error);
            }
        });
    }

    rawRequest(method, endpoint, body){
        return this.client.request(method, endpoint, body);
    }
}

module.exports = SlashAI;