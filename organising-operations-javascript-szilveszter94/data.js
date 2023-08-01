//Your code comes here

// task 1

let thisText = "Hello World";
let anotherText = "Second parameter";

// function logIntoTerminal(x){
//     console.log(x);
// }

// logIntoTerminal(thisText);


// task 2 & 5

function logIntoTerminal(toLog, secondToLog){
    let x2 = "Hello World";
    console.log(toLog);
    console.log(x2);
    console.log(secondToLog);
    function fourthFunction(){
        console.log("This is function inside a function");
    }
    fourthFunction();
}

logIntoTerminal(thisText, anotherText);

// task 3 & 6

function anotherFunction(){
    let newString = "string added"
    logIntoTerminal(newString, anotherText);
}

anotherFunction();


// task 4

const thirdFunction = function(){
    logIntoTerminal(thisText, anotherText);
}

thirdFunction();

function greetings(name){
    return "Greetings " + name + "!";
}

console.log(greetings("Anna"));
console.log(greetings("Szilveszter"));
console.log(greetings("Johnny"));
console.log(greetings("Jackson"));
console.log(greetings("Martinez"));


// DO NOT MODIFY THE CODE BELOW THIS LINE
let toExport;

try {
	toExport = [
		{name: "thisText", content: thisText, type: "string"},
        {name: "logIntoTerminal", content: logIntoTerminal, type: "function"},
        {name: "anotherFunction", content: anotherFunction, type: "function"},
        {name: "thirdFunction", content: thirdFunction, type: "function"},
        {name: "greetings", content: greetings, type: "function"},

	]
} catch (error) {
	toExport = {error: error.message}
}

export {toExport};
