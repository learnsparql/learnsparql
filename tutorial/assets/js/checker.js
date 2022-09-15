var responseUserInput = "";
const yasgui = new Yasgui(document.getElementById("yasgui"));
var responseRightAnswer;
yasgui.on("query", () => {

    fetch('https://dbpedia.org/sparql', {
            method: 'POST',
            headers: {
                'Accept': 'application/sparql-results+json,*/*;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': '250'
            },
            body: encodeURI(rightAnswerQuery)
        })
        .then((response) => response.json())
        .then((data) => responseRightAnswer = data);

    //renames variables in answer to different values, so that user can choose their own variable name
    //responseRightAnswer is not always defined on the first click as waiting for the HTTP Request takes some time
    //Variable names are not allowed to be named after array values!!!
    if (responseRightAnswer !== undefined) {
        var head = responseRightAnswer.head;
        var results = responseRightAnswer.results;
        for (i = 0; i < head.vars.length; i++) {
            let name = head.vars[i];
            let array = ['972', '973', '974', '975', '976', '977', '978', '979'];
            head.vars[i] = array[i];
            results.bindings[0][array[i]] = results.bindings[0][name];
            delete results.bindings[0][name];
        }
        responseRightAnswer.results = results;
        responseRightAnswer.head = head;
        console.log('Right response: ', responseRightAnswer);
    }
});


let yasr = yasgui.getTab().yasr;
yasr.on("drawn", () => {
    responseUserInput = yasr.results.json;
    if (responseUserInput !== undefined) {
        var head = responseUserInput.head;
        var results = responseUserInput.results;
        for (i = 0; i < head.vars.length; i++) {
            let name = head.vars[i];
            let array = ['972', '973', '974', '975', '976', '977', '978', '979'];
            head.vars[i] = array[i];
            results.bindings[0][array[i]] = results.bindings[0][name];
            delete results.bindings[0][name];
        }
        responseUserInput.results = results;
        responseUserInput.head = head;
        console.log('User response: ', responseUserInput);
    }


    if (_.isEqual(responseRightAnswer, responseUserInput)) {
        console.log('equivalent');
        document.getElementById('queryResult').src = "../../../assets/img/success_symbol.png";
        document.getElementById('queryResult').style.visibility = "visible";
    } else {
        console.log('not equivalent');
        document.getElementById('queryResult').src = "../../../assets/img/failed_symbol.png";
        document.getElementById('queryResult').style.visibility = "visible";
    }
});
document.getElementById('queryResult').style.visibility = "hidden";