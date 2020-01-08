const express = require('express');
const http = require('http');
const bodyparser = require('body-parser')
const scheduler = require('node-schedule');
const cp = require('child_process');
const moment = require('moment');
var checkMoment = moment();
const app = express();
const myPort = process.env.PORT || 3000;
app.use(bodyparser.json());
const optionsB = {
    hostname: 'localhost',
    port: 3030,
    path: '/executenowb',
    method: 'POST',
}
const optionsC = {
    hostname: 'localhost',
    port: 3031,
    path: '/executenowc',
    method: 'POST',
}
const optionsD = {
    hostname: 'localhost',
    port: 3032,
    path: '/executenowd',
    method: 'POST',
}

///////////////////////////option for schedule job on different machine
const optionScheduleRequestB = {
    hostname: 'localhost',
    port: 3030,
    path: '/executenowb',
    method: 'POST',
}

const optionScheduleRequestC = {
    hostname: 'localhost',
    port: 3031,
    path: '/executenowc',
    method: 'POST',
}

const optionScheduleRequestD = {
    hostname: 'localhost',
    port: 3032,
    path: '/executenowd',
    method: 'POST',
}
var reqGet = null;
///////////////////////////ExecuteNow Direct////////////////////////////////////
var proces = {
    contet: "ls"
}
app.post('/executenowdirect', (req, res) => {
    console.log(" GET on /executenow Direct ");
    var child = cp.spawn(proces.contet, ["-lrt"]);
    child.stdout.on("data", (data) => {
        console.log(`data: ${data}`);
        res.status(200).json("data = \n" + data);
    })
})
///////////////////////////ExecuteNow Section ///////////////////////////////////////////

///////////////////////////ExecuteNow B ///////////////////////////////////////////

app.post('/executenowB', (req, response) => {
    console.log("Execute NOW END point of Machine-B is accessed");
    reqGet = http.request(optionsB, responseFromChildServer => {
        console.log(`statusCode: ${responseFromChildServer.statusCode}`);
        responseFromChildServer.on('data', d => {
            console.log(" Data from Machine-B = " + d);
            response.status(200).send("data from Machine-B:" + d);
        })
    })
    reqGet.on('error', error => {
        console.log(" Error = " + error);
    })
    reqGet.end();
    console.log("Sent Response");
});

///////////////////////////ExecuteNow -C ///////////////////////////////////////////
app.post('/executenowC', (req, response) => {
    console.log("Execute NOW END point of Machine-C is accessed");
    reqGet = http.request(optionsC, responseFromChildServer => {
        console.log(`statusCode: ${responseFromChildServer.statusCode}`);
        responseFromChildServer.on('data', d => {
            console.log(" Data from Machine-C = " + d);
            response.status(200).send("data from Machine-C:" + d);
        })
    })
    reqGet.on('error', error => {
        console.log(" Error = " + error);
    })
    reqGet.end();
    console.log("Sent Response");
});

///////////////////////////ExecuteNow-D///////////////////////////////////////////
app.post('/executenowD', (req, response) => {
    console.log("Execute NOW END point of Machine-D is accessed");
    reqGet = http.request(optionsD, responseFromChildServer => {
        console.log(`statusCode: ${responseFromChildServer.statusCode}`);
        responseFromChildServer.on('data', d => {
            console.log(" Data from Machine-D = " + d);
            response.status(200).send("data from Machine-D:" + d);
        })
    })
    reqGet.on('error', error => {
        console.log(" Error = " + error);
    })
    reqGet.end();
    console.log("Sent Response");
});
////////////////////////////////////////////////Schedule JOB /////////////////////////

///////////////////////////////Schedule Machine-B////////////////////////////


var jobB = null, responseForServerB = null, dateValidate = null, scheduleJobList = { 'Job_ID': ' ', 'Schedule_Time': ' ' };
app.post('/scheduleJobb', function (req, response) {
    var jobBList = scheduler.scheduledJobs;
    dateValidate = JSON.stringify(req.body.Time);
    console.log('scheduleJobList.Job_ID' + scheduleJobList.Job_ID);
    console.log('dateValidate:' + dateValidate);
    var dateArr = dateValidate.split('"').join(',').split(',').filter(x => x);
    var scheduleMoment = moment({
        year: dateArr[0], month: parseInt(dateArr[1]) - 1, day: dateArr[2],
        hour: dateArr[3], minute: dateArr[4], second: dateArr[5]
    });

    console.log(dateArr);
    console.log(scheduleMoment);
    var timeCheckB = scheduleMoment.isValid();
    if (timeCheckB == true) {
        if (Object.keys(jobBList).length > 0) {
            console.log("Job already schedule on machine-B ");
            responseForServerB = "Job is already running on Machine-B ";
            //response.send(responseForServerB);
        }
        else {
            console.log('Time of job schedule for Machine-B:' + JSON.stringify(req.body.Time));
            var scheduledDate = scheduleMoment.toDate();
            scheduleJobList.Schedule_Time = dateValidate;
            scheduleJobList.Job_ID = 1;
            jobB = scheduler.scheduleJob(scheduledDate, () => {
                //   job = scheduler.scheduleJob('*/5 * * * * *', () => {
                console.log("Schedule JOB end point of Machine-B is accessed");
                reqGet = http.request(optionScheduleRequestB, responseFromChildServer => {
                    console.log(`statusCode: ${responseFromChildServer.statusCode}`);
                    responseFromChildServer.on('data', d => {
                        console.log(" Data from Machine-B = " + "\n" + d);
                        responseForServerB = d;
                    })
                })
                reqGet.on('error', error => {
                    console.log(" Error = " + error);
                    console.log("Server is busy");
                })
                reqGet.end();
                jobB.cancel();
            });
            console.log(jobB.nextInvocation());
        }
    }
    else {
        responseForServerB = 'Please check entered date and enter in given formate';
        console.log(responseForServerB);
    }
    response.status(200).send("Responce " + responseForServerB);
});
//////////////////////////////////////Cancel Machine-B's Job////////////////////////

app.post('/stopB', (req, res) => {
    var stat = null, responceReturn = null;
    console.log("Scheduled job cancel point for Machine-B is accessed");
    if (jobB != null) {
        jobB.cancel();
        jobB = null;
        console.log("Scheduled job for Machine-B was cancelled");
        stat = 200;
        responceReturn = "Scheduled Job on Machine-B was cancelled ";
    }
    else {
        console.log("Either job for Machine-B is not scheduled or Job is cancelld already");
        stat = 404;
        responceReturn = "Either job for Machine-B is not scheduled or Job is cancelld already";
    }
    res.status(stat).json('Either job for Machine-B is not scheduled or Job is cancelld already');
})


//////////////////////////////Schedule Machine-C///////////////////////////////////

var jobC = null, responceForServerC = null, dateValidateC = null, scheduleJobListC = { 'Job_ID': ' ', 'Schedule_Time': ' ' };
app.post('/scheduleJobc', function (req, response) {
    //console.log('Time of job schedule for Machine-C :' + JSON.stringify(req.body));
    var jobCList = scheduler.scheduledJobs;
    var dateValidateC = JSON.stringify(req.body.Time);
    scheduleJobListC.Schedule_Time = dateValidateC;
    scheduleJobListC.Job_ID = 1;
    console.log('dateValidateC ' + dateValidateC);
    var dateArr = dateValidateC.split('"').join(',').split(',').filter(x => x);
    var scheduleMomentC = moment({
        year: dateArr[0], month: parseInt(dateArr[1]) - 1, day: dateArr[2],
        hour: dateArr[3], minute: dateArr[4], second: dateArr[5]
    });
    console.log('dateArr' + dateArr);
    console.log('scheduleMomentC' + scheduleMomentC);
    var timeCheckC = scheduleMomentC.isValid();
    console.log(timeCheckC);
    if (timeCheckC == true) {
        if (Object.keys(jobCList).length > 0) {
            responceForServerC = "Job is already running on Machine-C";
            console.log('Job is already schedule on machine-C');
        } else {
            console.log('Time of job schedule for Machine-C:' + JSON.stringify(req.body.Time));
            var scheduledDateC = scheduleMomentC.toDate();
            scheduleJobList.Schedule_Time = dateValidateC;
            scheduleJobList.Job_ID = 1;
            jobC = scheduler.scheduleJob(scheduledDateC, () => {
                //   job = scheduler.scheduleJob('*/5 * * * * *', () => {
                console.log("Schedule JOB end point for Machine-C is accessed");
                reqGet = http.request(optionScheduleRequestC, responseFromChildServer => {
                    console.log(`statusCode: ${responseFromChildServer.statusCode}`);
                    responseFromChildServer.on('data', d => {
                        console.log(" Data from Machine-C  = " + "\n" + d);
                        responceForServerC = d;
                    })
                })
                reqGet.on('error', error => {
                    console.log(" Error = " + error);
                })
                reqGet.end();
                jobC.cancel();
            })
        }
    }
    else {
        responceForServerC = 'Please check entered date and enter in given formate';
        console.log(responceForServerC);
    }
    response.status(200).send("Responce " + responceForServerC);
});

//////////////////////////////////////////Cancel Machine-C's Job //////////////////////////

app.post('/stopC', (req, res) => {
    var stat = null;
    console.log("Scheduled job cancel point for Machine-C is accessed");
    if (jobC != null) {
        jobC.cancel();
        jobC = null;
        console.log("Scheduled job for Machine-C was cancelled");
        stat = 200;
        responceReturn = "Scheduled Job on Machine-C was cancelled ";
    }
    else {
        responceReturn = "Either job for Machine-C is not scheduled or Job is cancelld already";
        console.log(responceReturn);
        stat = 404;
    }
    res.status(stat).json('Either job for Machine-C is not scheduled or Job is cancelld already');
})

///////////////////////////////////////////Schedule Machine-D ////////////////////////////
var jobD = null, responceForServerD = null, scheduleJobListD = { 'Job_ID': ' ', 'Schedule_Time': ' ' };
app.post('/scheduleJobd', function (req, response) {

    var jobDList = scheduler.scheduledJobs;
    var dateValidateD = JSON.stringify(req.body.Time);
    scheduleJobListD.Schedule_Time = dateValidateD;
    scheduleJobListD.Job_ID = 1;
    console.log('dateValidateD ' + dateValidateD);
    var dateArr = dateValidateD.split('"').join(',').split(',').filter(x => x);
    var scheduleMomentD = moment({
        year: dateArr[0], month: parseInt(dateArr[1]) - 1, day: dateArr[2],
        hour: dateArr[3], minute: dateArr[4], second: dateArr[5]
    });
    console.log('dateArr' + dateArr);
    console.log('scheduleMomentD' + scheduleMomentD);
    var timeCheckD = scheduleMomentD.isValid();
    console.log(timeCheckD);
    if (timeCheckD == true) {
        if (Object.keys(jobDList).length > 0) {
            responceForServerD = "Job is already running on Machine-D";
            console.log('Job is already schedule on machine-D');
        } else {
            console.log('Time of job schedule for Machine-D:' + JSON.stringify(req.body.Time));
            var scheduledDateD = scheduleMomentD.toDate();
            scheduleJobListD.Schedule_Time = dateValidateD;
            scheduleJobListD.Job_ID = 1;
            jobD = scheduler.scheduleJob(scheduledDateD, () => {
                //   job = scheduler.scheduleJob('*/5 * * * * *', () => {
                console.log("Schedule JOB end point for machine-D is accessed");
                reqGet = http.request(optionScheduleRequestD, responseFromChildServer => {
                    console.log(`statusCode: ${responseFromChildServer.statusCode}`);
                    responseFromChildServer.on('data', d => {
                        console.log(" Data from Machine-D Server = " + "\n" + d);
                        responceForServerD = d;
                    })
                })
                reqGet.on('error', error => {
                    console.log(" Error = " + error);
                })
                reqGet.end();
                jobD.cancel();
            })
        }
    }
    else {
        responceForServerC = 'Please check entered date and enter in given formate';
        console.log(responceForServerD);
    }
    response.status(200).send("Responce " + responceForServerD);
});

/////////////////////////////Cancel Machine-D's Job /////////////////////////

app.post('/stopD', (req, res) => {
    var stat = null;
    console.log("Scheduled job cancel point accessed");
    if (jobD != null) {
        jobD.cancel();
        jobD = null;
        console.log("Scheduled job for Machine-C was cancelled");
        stat = 200;
        responceReturn = "Scheduled Job on Machine-C was cancelled ";
    }
    else {
        responceReturn = "Either job for Machine-C is not scheduled or Job is cancelld already";
        console.log(responceReturn);
        stat = 404;
    }
    res.status(stat).json('Either job for Machine-C is not scheduled or Job is cancelld already');
})


///////////////// cancel request //////////////////


app.listen(myPort, () => {
    console.log(' microservices start listining on port ' + myPort);
    console.log('This is main server');

});