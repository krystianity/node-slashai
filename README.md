# node-slashai
- machine learning as a service
- rest client for api.slash.ai
- 100% promises wrapping request.js
- checkout https://api.slash.ai/apidoc for documentation

```javascript
//### general API-Client setup

const Slash = require("slashai");

const slash = new Slash({
    email: "",
    password: "",
    log: console.log
});
```

```javascript
//### using Neuronal Network APIs

slash.network.createDeep(3, [3,3,3], 2).then(id => {
       return slash.await(id); //wait for creation to complete
}).then(result => {
    const networkId = result.objectId;
    return slash.network.getInstance(networkId); //wrap in an object for easy access
}).then(network => {
    
    //train your created network
    network.train([
        { input: [0.1, 0.2, 0.3], output: [0.5, 0.6]},
        { input: [0.5, 0.6, 0.7], output: [0.2, 0.1]}
    ]).then(id => {
        return slash.await(id); //wait for training to complete
    }).then(result => {
        if(result.status !== "done"){
           return console.log("training failed: " + result.error);
        }
        
        console.log("training completed: " + JSON.stringify(result.result));
    });
    
    //process a network request
    network.process([0.2, 0.4, 0.5]).then(result => {
        console.log("process result: " + result.output);
    });
    
    //get information about a created network
    network.info().then(info => console.log(info));
    
    //delete a network
    network.remove().then(id => {
        return slash.await(id); //wait for network to be deleted
    }).then(result => {
        if(result.status === "done"){
            console.log("network " + network.id + " has been deleted.");
        }
    });
});

```

```javascript
//### using Classifier API 

//tbw
```

```javascript
//### using Classifier Commands API 

//tbw
```

```javascript
//### using Natural Language Processing API 

slash.nlp.identifyLanguage("i am the bonfire").then(languages => {
    console.log("its most likely: " + languages[0][0]);
});

```