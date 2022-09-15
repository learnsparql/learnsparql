var responseUserInput = "";
var once = false;
const yasgui = new Yasgui(document.getElementById("yasgui"));
var responseRightAnswer;
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

function getRandomNumberArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min) + 1;
}

function extendArray(array, number) {
    return array.concat([number]);
}

var varHolder = [542, 679, 775]; // just random number array, variable names are not allowed to be named after array values!!!

yasgui.on("query", () => {
    //renames variables in answer to different values, so that user can choose their own variable name

    if (responseRightAnswer !== undefined) {
        var head = responseRightAnswer.head;
        var results = responseRightAnswer.results;
        if (once == false) {
            for (i = 0; i < head.vars.length; i++) {
                if (i + 1 > varHolder.length) {
                    varHolder = extendArray(varHolder, getRandomNumberArbitrary(varHolder[varHolder.length - 1], varHolder[varHolder.length - 1] * 2));
                }
                let name = head.vars[i];
                head.vars[i] = varHolder[i];
                results.bindings[0][varHolder[i]] = results.bindings[0][name];
                delete results.bindings[0][name];
            }
            once = true;
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
            if (i + 1 > varHolder.length) {
                varHolder = extendArray(varHolder, getRandomNumberArbitrary(varHolder[varHolder.length - 1], varHolder[varHolder.length - 1] * 2));
            }
            let name = head.vars[i];
            head.vars[i] = varHolder[i];
            results.bindings[0][varHolder[i]] = results.bindings[0][name];
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