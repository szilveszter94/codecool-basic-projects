/*
    DO NOT MODIFY THIS FILE

	This file is for testing purposes only.
	Don't worry if you don't understand it yet, you can come back later and check it again.
*/

import {toExport as data} from "./data.js";

const typeIssue = (name, type) => `The variable named ${name} is not a(n) ${type}.`;
const typeTest = (content, type) => type === "array" ? Array.isArray(content) : (typeof content === type);

if (data.error){
    console.log(`At least the variable named ${data.error} (there is a chance that other ones are also missing).`);
} else {
    const error = data.reduce((p, {name, content, type}) => typeTest(content, type) ? p : [...p, typeIssue(name, type)], [])
    if (error.length){
        console.log(error.join(`\n`));
    } else {
        console.log(`
            Your solution seems fine! \n
            Don't forget this test is checking the existence and the types of your variables, but not the content of them. \n
            Always check the tasks' acceptance criteria.
        `);
    }
}
