var responseUserInput = "";
const yasgui = new Yasgui(document.getElementById("yasgui"));
var responseRightAnswer;
yasgui.on("query",() => {
                
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
        .then((data) => responseRightAnswer = data)
        .then(() => console.log('Right response: ', responseRightAnswer));
});  
let yasr = yasgui.getTab().yasr;
yasr.on("drawn",() => {
    responseUserInput =yasr.results.json;
    console.log('User input: ', responseUserInput);
  
    if (_.isEqual(responseRightAnswer,responseUserInput)){
        console.log('equivalent');
        document.getElementById('queryResult').src="../../../assets/img/success_symbol.png";
        document.getElementById('queryResult').style.visibility = "visible";
    } else {
        console.log('not equivalent');
        document.getElementById('queryResult').src="../../../assets/img/failed_symbol.png";
        document.getElementById('queryResult').style.visibility = "visible";
    }}); 
document.getElementById('queryResult').style.visibility = "hidden";