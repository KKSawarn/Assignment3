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
var responseFromServer = "", jobPbox = null;
var executeStatusRbox1= null, executeStatusRbox2=null, 
    executionDateTimeRbox1=null, executionDateTimeRbox2= null,
    executionDateTimePbox=null, executeStatusPbox=null;
    executionDateTimePboxScheduleWeek =null, schedulePboxExecuteStatusWeek =null;
    executionDateTimePboxScheduleDayMonth =null, schedulePboxExecuteStatusOnceDateMonth =null,
    executionDateTimePboxScheduleDateMonth =null, schedulePboxExecuteStatusOnceDayeMonth =null;
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
                //////////////////for execution time/////////////////
                let executeTime = new Date();
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
                executionDateTimeRbox1 = executionTime + ' ' + executionDate;
                console.log('Execution time: ', executionDateTimeRbox1);
                console.log('esponse.statusCode', response.statusCode);
                let responseValue = response.statusCode;
                 executeStatusRbox1 = response.statusCode;
                if (responseValue == 200) {
                    responseFromServer = "R-Box on I.P. 172.16.50.243 is executed successfully on " + executionDateTimeRbox1 + "  !!!";
                    console.log(responseFromServer);
                }
                else if (responseValue == 404) {
                    responseFromServer = "R-Box on I.P. 172.16.50.243 is not executed successfully on " + executionDateTimeRbox1 + "  !!!";
                    console.log(responseFromServer);
                } else {
                    responseFromServer = "Request for 172.16.50.243 execution not found on " + executionDateTimeRbox1 + "  !!!";
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
            }, (error, respon, body) => {
                //////////////////////////////////////////////////////////////////
                let executeTime = new Date();
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
                executionDateTimeRbox2 = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimeRbox2);
                let responseValue = respon.statusCode;
                 executeStatusRbox2 = respon.statusCode;
                if (responseValue == 200) {
                    responseFromServer = "R-Box is on I.P. 172.14.33.256 executed successfully on " + executionDateTimeRbox2 + "  !!!";
                    console.log(responseFromServer);
                }
                else if (responseValue == 404) {
                    responseFromServer = "Request R-Box on I.P. 172.14.33.256 is not executed successfully on " + executionDateTimeRbox2 + "  !!!";
                    console.log(responseFromServer);
                } else {
                    responseFromServer = "Request for 172.14.33.256 execution not found on " + executionDateTimeRbox2 + "  !!!";
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
    }
    else if (destination == 'PBOX') {
        console.log("Entered ip ", iP);
        let pboxIP = "172.16.50.171";
        console.log('P-Box ', pboxIP)
        if (pboxIP == iP) {
            var child = cp.spawn(proces.content, ["reboot"]);
            let executeTime = new Date();
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
                executionDateTimePbox = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePbox);
                executeStatusPbox = res.statusCode;
                console.log(executeStatusPbox)
            responseFromServer = "P-Box is executed successfully on " + executionDateTimePbox+" !!!";
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

        ///////////////////schedulig on each fix day in a given month /////////////////////
        if ((date == 0) && ((month > 0) && (month < 13)) && (day != null)) {
            dateMonth = month;
            console.log('P-Box scheduled on each', day, 'of month', month);
            console.log('dateMonth ', dateMonth);
            let clockTime = '00 33 14';
            let dateValidate = (clockTime + ' ' + '*' + ' ' + dateMonth + ' ' + day);
            console.log('dateValidate ', dateValidate);
            let executeTime = new Date();
            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
                executionDateTimePboxScheduleWeek = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleWeek);
                schedulePboxExecuteStatusWeek = res.statusCode;
            });
            responseFromServer = 'Reboot request is accepted';
            console.log(responseFromServer)
        }


        ////////////////////scheduling on fix day of week once in month///////////////////////////

        else if ((date == 00) && (month == 0) && (day != null) && (execute == 'once')) {
            let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
            let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
            console.log('P-Box scheduled on each first ', day, 'of each month');
            console.log('day ', day);
            console.log('month', month);
            let clockTime = '00 25 16';
            let dateValidate = (clockTime + ' ' + '1-7 ' + ' ' + '1-12' + ' ' + day);
            console.log('dateValidate ', dateValidate);

            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
                executionDateTimePboxScheduleDayMonth = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleDayMonth);
                schedulePboxExecuteStatusOnceDayMonth = res.statusCode;
            });
            responseFromServer = 'Reboot request is accepted';
            console.log(responseFromServer)
        }

        /////////////////////////////Scheduling on fix date of month at fix time once in a month
        else if ((date > 0) && ((month > 0) && (month < 13)) && (day == 0)) {
            console.log('date ', date);
            console.log('month', month);
            
            let clockTime = '00 28 16';
            let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
            let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":" + executeTime.getDay();
            let dateValidate = (clockTime + ' ' + ' ' + date + ' ' + month + '-12 ' + '*');
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
                var child = cp.spawn(proces.content, ["reboot"]);
                console.log("reboot cmd run");
                executionDateTimePboxScheduleDayMonth = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleDayMonth);
                schedulePboxExecuteStatusOnceDateMonth = res.statusCode;
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

app.post('/retrivenow', (req, res) => {
    var responseFromServerExecutStatus = null;
    var destination = req.body.type;
    destination = destination.toUpperCase();
    var iP = req.body.ip;
    var access = req.body.access;
    access = access.toUpperCase();
    ////////R-Box Retrive section/////////////////////////////////////////////////////
    if (destination == 'RBOX') {
        if (iP == '172.16.50.243') {
            if (executeStatusRbox1 == 200) {
                console.log('executeStatusiP', executeStatusRbox1)
                responseFromServerExecutStatus = "Execution of R-Box found on machine " + iP + " successfull on" +executionDateTimeRbox1;
                console.log(responseFromServerExecutStatus);
            }
            else if (executeStatusRbox1 == 404) {
                responseFromServerExecutStatus = "Execution of R-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimeRbox1;
                console.log(responseFromServerExecutStatus);
            }
            else {
                console.log(executeStatusRbox1);
                responseFromServerExecutStatus = "R-Box did not get request for execution !!!";
                console.log(responseFromServerExecutStatus);
            }
        } else if (iP == '172.14.33.256') {
            if (executeStatusRbox2 == 200) {
                console.log('executeStatusiP', executeStatusRbox2)
                responseFromServerExecutStatus = "Execution of R-Box found on machine " + iP + " successfull on" +executionDateTimeRbox2;
                console.log(responseFromServerExecutStatus);
            }
            else if (executeStatusRbox2 == 404) {
                responseFromServerExecutStatus = "Execution of R-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimeRbox2;
                console.log(responseFromServerExecutStatus);
            }
            else {
                console.log(executeStatusRbox2);
                responseFromServerExecutStatus = "R-Box did not get request for execution !!!";
                console.log(responseFromServerExecutStatus);
            }
        }
        ////////////////////P-Box Retrive section/////////////////////////////////////////
    }else if(destination == 'PBOX'){
        if (iP == '172.16.50.171') {
            if (executeStatusPbox == 200) {
                responseFromServerExecutStatus = "Execution of P-Box found on machine " + iP + " successfull on" +executionDateTimePbox;
                console.log(responseFromServerExecutStatus);
            }
            else if (executeStatusPbox == 404) {
                responseFromServerExecutStatus = "Execution of P-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimePbox;
                console.log(responseFromServerExecutStatus);
            }
            else {
                console.log(executeStatusPbox);
                responseFromServerExecutStatus = "P-Box did not get request for execution !!!";
                console.log(responseFromServerExecutStatus);
            }
        }else{
            console.log("week ")
            responseFromServerExecutStatus = "Wrong I.P. for P-Box request";
            console.log(responseFromServerExecutStatus);
        }  
    }else if(destination == 'SCHEDULEPBOX'){
        console.log("week ")
        //////////////////////////retrivr schedling fix day of week once ///////////////////////
        if(access == 'WEEK'){
            if(schedulePboxExecuteStatusWeek == 200){
                responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else if(schedulePboxExecuteStatusWeek == 404){
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else {
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
                console.log(responseFromServerExecutStatus); 
            }
        }
        //////////////////////////retrivr schedling fix day of month once ///////////////////////
        else if(access =='MONTH'){
            if(schedulePboxExecuteStatusOnceDayMonth == 200){
                responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else if(schedulePboxExecuteStatusOnceDayMonth == 404){
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else {
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
                console.log(responseFromServerExecutStatus); 
            }
        }
        //////////////////////////retrivr schedling fix date of month once ///////////////////////
        else if(access == 'DATE'){
            if(schedulePboxExecuteStatusOnceDateMonth == 200){
                responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else if(schedulePboxExecuteStatusOnceDateMonth == 404){
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
                console.log(responseFromServerExecutStatus); 
            }else {
                responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
                console.log(responseFromServerExecutStatus); 
            }
        }
    }
    res.status(200).send(responseFromServerExecutStatus);
})
app.listen(port, () => {
    console.log("Listing on port number :" + port);
});
