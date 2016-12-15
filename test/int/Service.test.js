const expect = require("expect.js");
const SlashAI = require("./../../index.js");

describe("Service INT", function () {

    before(function(done){
        if(!process.env.SLASH_MAIL || !process.env.SLASH_PSW){
            throw new Error("Service Test expects SLASH_MAIL and SLASH_PSW to be set as env variables.");
        }
        done();
    });

    const slash = new SlashAI({
        email: process.env.SLASH_MAIL,
        password: process.env.SLASH_PSW,
        log: console.log
    });

    it("should be able to check the alive status", function(done){
        slash.alive().then(r => {
            expect(r).to.be.equal(true);
            done();
        });
    });

    it("should be able to check the authorization", function(done){
        slash.authcheck().then(r => {
            expect(r).to.be.equal(true);
            done();
        });
    });

    describe("NLP", function(){

        it("should be able to identify the language of a text", function(done){

            slash.nlp.identifyLanguage("i am the bonfire").then(r => {
                console.log(r);
                expect(r[0][0]).to.be.equal("english");
                done();
            });
        });
    });

    describe("Commands", function(){

        let commandId = null;

        it("should be able to create a commands classifier", function(done){
            this.timeout(5000);

            const trainingSet = [
                [ "one", "blup blup"],
                [ "two", "blur blur"]
            ];

            const filter = ["bla"];

            slash.commands.create(trainingSet, filter, "en").then(id => {
                return slash.await(id);
            }).then(result => {
               console.log(result);
                expect(result.objectId).not.to.be.equal(null);
                expect(result.status).to.be.equal("done");
                expect(result.error).to.be.equal(null);
                commandId = result.objectId;
                done();
            }, e => {
                console.log(e);
            });
        });

        it("should be able to process using a commands classifier", function(done){

            expect(commandId).not.to.be.equal(null);

            const input = "bla blup bla xd 123";

            slash.commands.process(commandId, input).then(result => {
                console.log(result);
                done();
            });
        });

        it("should be able to delete a commands classifier", function(done){

            expect(commandId).not.to.be.equal(null);

            slash.commands.remove(commandId).then(id => {
                return slash.await(id);
            }).then(result => {
                console.log(result);
                expect(result.status).to.be.equal("done");
                expect(result.error).to.be.equal(null);
                done();
            });
        });
    });

    describe("Network", function(){

        let networkId = null;
        let networkObject = null;

       it("should be able to create network", function(done){

           slash.network.createDeep(3, [3,3,3], 2).then(id => {
               return slash.await(id);
           }).then(result => {
              console.log(result);
               networkId = result.objectId;
               expect(networkId).not.to.be.equal(null);
               expect(result.error).to.be.equal(null);
               expect(result.status).to.be.equal("done");
               done();
           });
       });

        it("should be able to train a network", function(done){

            expect(networkId).not.to.be.equal(null);

            const trainingSet = [
                { intput: [0.2, 0.25, 0.2], output: [0.5, 0.5]},
                { intput: [0.3, 0.3, 0.35], output: [0.8, 0.7]},
                { intput: [0.1, 0.05, 0.12], output: [0.3, 0.3]},
                { intput: [0.15, 0.18, 0.14], output: [0.1, 0.2]},
                { intput: [0.9, 0.7, 0.6], output: [0.9, 0.9]}
            ];

            slash.network.train(networkId, trainingSet).then(id => {
                return slash.await(id);
            }).then(result => {
                console.log(result);
                expect(result.error).to.be.equal(null);
                expect(result.status).to.be.equal("done");
                done();
            });
        });

        it("should be able to get a network", function(done){

            expect(networkId).not.to.be.equal(null);
            networkObject = slash.network.getInstance(networkId);
            expect(networkObject).not.to.be.equal(null);

            networkObject.info().then(result => {
               console.log(result);
                done();
            });
        });

        it("should be able to process a network request", function(done){

            expect(networkObject).not.to.be.equal(null);

            const input = [0.25, 0.22, 0.34];

            networkObject.process(input).then(result => {
               console.log(result);
                done();
            });
        });

        it("should be able to delete a network", function(done){

            expect(networkObject).not.to.be.equal(null);

            networkObject.remove().then(id => {
                return slash.await(id);
            }).then(result => {
                console.log(result);
                expect(result.error).to.be.equal(null);
                expect(result.status).to.be.equal("done");
                done();
            });
        });
    });

});