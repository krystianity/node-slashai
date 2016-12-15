class NLP {

    constructor(client, options){
        this.client = client;
    }

    identifyLanguage(text){
        return this.client.request("POST", "/api/v2/nlp/tools/language", {text})
            .then(({status, body}) => {

                if(status === 200){
                    return body.languages;
                }

                throw new Error(body.error);
            });
    }

}

module.exports = NLP;