const express = require('express');
const http = require('http');
const app = express();
const myPort = process.env.PORT || 3040;
const options = {
    hostname: 'localhost',
    port: 3030,
    path: '/executenow',
    method: 'GET',
}
var reqGet =null;
app.get('/executenow', function ( req, response) {
    console.log("Execute NOW END point accessed");   
    reqGet = http.request(options, responseFromChildServer => {
        console.log(`statusCode: ${responseFromChildServer.statusCode}`);
        responseFromChildServer.on('data', d => {
            console.log(" Data from Child Server = " + d);
        })
    })
    reqGet.on('error', error => {
        console.log(" Error = " + error);
    })
    reqGet.end();
    console.log("Sent Response");
    response.status(200).send("Hello World \n");
});
app.listen(myPort, () => {
    console.log(' microservices start: listining on port ' + myPort);
});