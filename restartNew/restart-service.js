const express = require('express');
var scheduler = require('node-cron');
const cp = require('child_process');
const moment = require('moment');
const request = require('request');
const app = express();
app.use(express.json());
const port = process.env.PORT || 6010;
var proces = {
    content: 'sudo'
}
app.use(express.json());
var responseFromServer = "", jobPbox = null, r = null;
var executeStatus = null;
///////////////////////////////////////Executenow section /////////////////////////////
app.post('/executenow', (req, res) => {
    var destination = req.body.type;
    destination = destination.toUpperCase();
    var user = req.body.user;
    var password = req.body.password;
    var iP = req.body.ip;
    console.log("Entered destination type ", destination);
    //////////////////////////////////R-Box section///////////////////////////////////////////
    if (destination == 'RBOX') {
        if (iP == '172.16.50.243') {
            console.log('req.body user  ', user)
            console.log('req.body.password  ', password)
            console.log('req.body.iP', iP);
            request.post('http://localhost:3200/restart', {
                json: {
                    "user": user,
                    "password": password
                }
            }, (error, response, body) => {
                let responseValue = response.statusCode;
                executeStatus = response.statusCode;
                if (responseValue == 200) {
                    responseFromServer = "R-Box on I.P. 172.16.50.243 is executed successfully !!!";
                    console.log(responseFromServer);
                }
                else if (responseValue == 404) {
                    responseFromServer = "Request for 172.16.50.243 execution not found !!!";
                    console.log(responseFromServer);
                } else {
                    responseFromServer = "Server busy !!!";
                    console.log(responseFromServer);
                }

                if (error) {
                    console.log(error);
                }
                console.log('statusCode ', res.statusCode);
                console.log('body ', body);
            })
        } else if (iP == '172.14.33.256') {
            console.log('req.body user  ', user)
            console.log('req.body.password  ', password)
            console.log('req.body.iP', iP);
            request.post('http://localhost:3210/restart', {
                json: {
                    "user": user,
                    "password": password
                }
            }, (error, response, body) => {
                let responseValue = response.statusCode;
                if (responseValue == 200) {
                    responseFromServer = "R-Box is on I.P. 172.14.33.256 executed successfully !!!";
                    console.log(responseFromServer);
                }
                else if (responseValue == 404) {
                    responseFromServer = "Request for I.P. 172.14.33.256 execution not found !!!";
                    console.log(responseFromServer);
                } else {
                    responseFromServer = "Server busy !!!";
                    console.log(responseFromServer);
                }

                if (error) {
                    console.log(error);
                }
                console.log('statusCode ', res.statusCode);
                console.log('body ', body);
            })
        }
        //////////////////////////////////////////////////Pbox section////////////////
        else if (destination == 'PBOX') {
            console.log("Entered ip ", iP);
            let pboxIP = "172.16.50.243";
            console.log('P-Box ', pboxIP)
            if (pboxIP == iP) {
                var child = cp.spawn(proces.content, ["reboot"]);
                responseFromServer = "P-Box is executed successfully !!!";
                console.log(responseFromServer);
            }
            else {
                responseFromServer = " Given IP address doesn't match with P-Box IP address";
                console.log(responseFromServer);
            }
        }
        else {
            responseFromServer = "Request not matched !!!";
            console.log(responseFromServer);
        }
        res.status(200).send(responseFromServer + " !!!");
    }
});

///////////////////////////////Schedulenow Section /////////////////////////////////////////

app.post('/schedulenow', (req, res) => {

    var destination = req.body.type;
    destination = destination.toUpperCase();
    var date = req.body.date;
    var month = req.body.month;
    var day = req.body.day;
    var execute = req.body.execute;
    console.log("Entered destination type ", destination);
    /////////////////////////////////////////P-BOX Scheduling /////////////////////////

    if (destination == 'SCHEDULEPBOX') {
        let dateMonth = null;
        console.log('date', date);
        console.log('month', month);
        console.log('day', day);
        console.log('execute', execute);
        console.log('day ', day);
        if ((date == 0) && ((month > 0) && (month < 13)) && (day != null)) {
            dateMonth = month;
            console.log('P-Box scheduled on each', day, 'of month', month);
            console.log('dateMonth ', dateMonth);
            let clockTime = '00 06 12';
            let dateValidate = (clockTime + ' ' + '*' + ' ' + dateMonth + ' ' + day);
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
            });
            responseFromServer = 'Reboot request is accepted';
            console.log(responseFromServer)
        }


        ////////////////////scheduling on fix day of week once in month///////////////////////////

        else if ((date == 00) && (month == 0) && (day != null) && (execute == 'once')) {

            console.log('P-Box scheduled on each first ', day, 'of each month');
            console.log('day ', day);
            console.log('month', month);
            let clockTime = '00 08 12';
            let dateValidate = (clockTime + ' ' + '1-7 ' + ' ' + '1-12' + ' ' + day);
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
            });
            responseFromServer = 'Reboot request is accepted';
            console.log(responseFromServer)
        }

        /////////////////////////////Scheduling on fix date of month at fix time once in a month
        else if ((date > 0) && ((month > 0) && (month < 13)) && (day == 0)) {
            console.log('date ', date);
            console.log('month', month);
            let clockTime = '00 05 13';
            let dateValidate = (clockTime + ' ' + ' ' + date + ' ' + month + '-12 ' + '*');
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
            });
            responseFromServer = 'Reboot request is accepted';
            console.log(responseFromServer)
        }
        else {
            console.log('Please check entered date and time value');
        }
    } else if (destination == 'STOPPBOX') {
        if (jobPbox != null) {
            jobPbox.stop();
            jobPbox = null;
            responseFromServer = 'Schedule job for P-Box is stopped successfully';
            console.log(responseFromServer);
        } else {
            responseFromServer = 'Schedule job for P-Box is not found';
            console.log(responseFromServer);
        }
    }
    else {
        responseFromServer = "Request not matched !!!";
        console.log(responseFromServer);
    }
    res.status(200).send(responseFromServer + " !!!");
});

//////////////////////////////////////////////////RETRIVE SECTION////////////////////////////////


////////R-Box Retrive section/////////////////////////////////////////////////////
app.post('/retrivenow', (req, res) => {
    var responseFromServerExecutStatus =null;
    var destination = req.body.type;
        destination = destination.toUpperCase();
    if (destination == 'RBOX') {
        
        var user = req.body.user;
        var password = req.body.password;
        var iP = req.body.ip;
        if (executeStatus == 200) {
            console.log(executeStatus)
            responseFromServerExecutStatus = "Execution of R-Box found for  " + user + "  found on machine " + iP + " successfull.";
            console.log(responseFromServerExecutStatus);
        }
        else if (executeStatus == 404) {
            responseFromServerExecutStatus = "Execution of R-Box found for " + user + "doesn,t found on machine" + iP + "successfull.";
            console.log(responseFromServerExecutStatus);
        }
        else {
            console.log(executeStatus);
            responseFromServerExecutStatus = "Something went wrong !!!";
            console.log(responseFromServerExecutStatus);
        }
    }
    ////////////////////P-Box Retrive section/////////////////////////////////////////
    else if (destination == 'PBOX') {
        var destination = req.body.type;
        destination = destination.toUpperCase();
        var date = req.body.date;
        var month = req.body.month;
        var day = req.body.day;
        var execute = req.body.execute;
        console.log("Entered destination type ", destination);

    }
    res.status(200).send(responseFromServerExecutStatus);
})







app.listen(port, () => {
    console.log("Listing on port number :" + port);
});
