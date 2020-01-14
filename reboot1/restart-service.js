const express = require('express');
const http = require('http');
const cp = require('child_process');
const app = express();
app.use(express.json());
const optionRbox ={
    hostname : 'localhost',
    port : 3200,
    path : '/restart',
    method : 'POST',
    body: {
        "iP": "12,00,00,000"
    },
    json : true
}

const port = process.env.PORT || 6010;
var proces = {
    content: 'sudo'
}

var responceFromServer = "",reqGet="";
app.post('/executenow', (req, res) => {
    var destination = JSON.stringify(req.body.type);
    var ip = JSON.stringify(req.body.ip);
    var iP = ip.replace(/"/g, "");
    console.log('iP ' +iP);
    console.log('req.body ip  ' +ip)
    console.log('req.body type  ' +req.body.type)
    console.log("request : " + destination);
    if ((destination == '"rbox"') || (destination == '"Rbox"') || (destination == '"RBOX"')) {
        console.log("Accept request !!! for r box")
        reqGet = http.request(optionRbox, responceFromRbox => {
            console.log("send request !!! for r box")
            let responceValue = responceFromRbox.statusCode;
            console.log('responceFromRbox.statusCode' + responceValue);
            if (responceValue == 200) {
                responceFromServer = "R-Box is executed successfully !!!";
                console.log(responceFromServer);
            }
            else if (responceValue == 404) {
                responceFromServer = "Request for execution not found !!!";
                console.log(responceFromServer);
            } else {
                responceFromServer = "Server busy !!!";
                console.log(responceFromServer);
            }
        })
        reqGet.on('error', error => {
            console.error(error);
        });
        console.log("Send data " +JSON.stringify(iP));
        console.log('typeof ' + typeof iP);
        //reqGet.write(iP);
        reqGet.end();
    }
    //////////////////////////////////////////////////Pbox section////////////////
    else if ((destination == '"pbox"') || (destination == '"Pbox"') || (destination == '"PBOX"')) {
        var child = cp.spawn(proces.content, ["reboot"]);
        responceFromServer = "P-Box is executed successfully !!!";
        console.log(responceFromServer);
    } else {
        responceFromServer = "Request not matched !!!";
        console.log(responceFromServer);
    }
    res.status(200).send(responceFromServer + " !!!");
})
app.listen(port, () => {
    console.log("Listing on port number :" + port);
});
