const http = require('http');
const readline = require('readline');
const optionExecuteNow = {
    hostname: 'localhost',
    port: 3000,
    path: '/executenowdirect',
    method: 'POST',
}
////////////////execute option for all mechine
const optionExecuteB = {
    hostname: 'localhost',
    port: 3003,
    path: '/executenowB',
    method: 'POST',
}
const optionExecuteC = {
    hostname: 'localhost',
    port: 3000,
    path: '/executenowC',
    method: 'POST',
}
const optionExecuteD = {
    hostname: 'localhost',
    port: 3000,
    path: '/executenowD',
    method: 'POST',
}
const optionScheduleB = {
    hostname: 'localhost',
    port: 3000,
    path: '/scheduleJobb',
    method: 'POST',
    headers: {
        "content-type": "application/json"
    }
}

const optionScheduleC = {
    hostname: 'localhost',
    port: 3000,
    path: '/scheduleJobc',
    method: 'POST',
    headers: {
        "content-type": "application/json"
    }
}

const optionScheduleD = {
    hostname: 'localhost',
    port: 3000,
    path: '/scheduleJobd',
    method: 'POST',
    headers: {
        "content-type": "application/json"
    }
}

const optionCancelB = {
    hostname: 'localhost',
    port: 3000,
    path: '/stopB',
    method: 'POST',
}
const optionCancelC = {
    hostname: 'localhost',
    port: 3000,
    path: '/stopC',
    method: 'POST',
}
const optionCancelD = {
    hostname: 'localhost',
    port: 3000,
    path: '/stopD',
    method: 'POST',
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var statusCode = null, reqGet = null, time = null, timeData=" ";
/////////////////////////// ExecuteNow Direct /////////////////

if ((process.argv[2] == "ExecuteNowDirect") || (process.argv[2] == "executenowdirect") || (process.argv[2] == "EXECUTENOWDIRECT")) {
    reqGet = http.request(optionExecuteNow, res => {
        console.log(`statusCode: ${res.statusCode}`);
         res.on('data', d => {
             process.stdout.write(d)
         })
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
    console.log("In ExecuteNowDirect block ");
}
//////////////////////////////////ExecuteNow with mechine   ///////////////////////////////



///////////////////////////////ExecuteNow mecine :B   ///////////////////////
else if ((process.argv[2] == "executenowb") || (process.argv[2] == "ExecuteNow") || (process.argv[2] == "EXECUTENOW")) {
    reqGet = http.request(optionExecuteB, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            if(res.statusCode == 200){
                console.log("ExecuteNowEnd point of MECHINE-B accessed and server responded successfully");
            }
            else{
                console.log("Execute now end point of MECHINE-B accessed and server responded but something is wrong");
            }
        })
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}
///////////////////////////////executeNow Mechine-C    /////////////////////////
else if ((process.argv[2] == "executenowc") || (process.argv[2] == "ExecuteNowC") || (process.argv[2] == "EXECUTENOWC")) {
    reqGet = http.request(optionExecuteC, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            if(res.statusCode == 200){
                console.log("ExecuteNowEnd point of MECHINE-C accessed and server responded successfully");
            }
            else{
                console.log("Execute now end point of MECHINE-C accessed and server responded but something is wrong");
            }
        })
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}
///////////////////////////////executeNow Mechine-D    /////////////////////////

else if ((process.argv[2] == "executenowd") || (process.argv[2] == "ExecuteNowD") || (process.argv[2] == "EXECUTENOWD")) {
    reqGet = http.request(optionExecuteD, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            if(res.statusCode == 200){
                console.log("ExecuteNowEnd point of MECHINE-D accessed and server responded successfully");
            }
            else{
                console.log("Execute now end point of MECHINE-D accessed and server responded but something is wrong");
            }
        })
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}
/////////////////////////////////// Schedule JOB       /////////////////////////////////


/////////////////////////////////////////////Schedule Job for Mechine-B /////////////////////////


else if ((process.argv[2] == "scheduleb") || (process.argv[2] == "ScheduleB") || (process.argv[2] == "SCHEDULEB")) {
    console.log("Enter date and time(in 24 hours formate) to schedule your job execution: yy,mm,dd,hh,mm");
    console.log("Example: 1993,06,10,05,00,00");
    rl.question('Enter time :', (time) => {
        for(var i=0;i<= time.length - 9; i++){
            timeData = timeData + time.charAt(i);
        }
        console.log('Your job is scheduled at ' + time + ' time');
        var postData = { 'Time': time };
        reqGet = http.request(optionScheduleB, res => {
            console.log('statusCode:', +res.statusCode);
            res.on('data', d => {
                process.stdout.write(d);
            });
        });
        reqGet.on('error', error => {
            console.error(error);
        });
        reqGet.write(JSON.stringify(postData));
        reqGet.end();
        rl.close();
    });
}

////////////////////////////////////////////////////Schedule job for Mechine-C/////////////////////////

else if ((process.argv[2] == "schedulec") || (process.argv[2] == "ScheduleC") || (process.argv[2] == "SCHEDULEC")) {
    console.log("Enter date and time(in 24 hours formate) to schedule your job execution: yy,mm,dd,hh,mm");
    console.log("Example: 1993,06,10,05,00");
    rl.question('Enter time :', (time) => {
        console.log('Your job is scheduled at ' + time + ' time');
        var postData = { 'Time': time };
        reqGet = http.request(optionScheduleC, res => {
            console.log(`statusCode: ${res.statusCode}`);
            // res.on('data', d => {
            //     process.stdout.write(d);
            // });
        });
        reqGet.on('error', error => {
            console.error(error);
        });

        reqGet.write(JSON.stringify(postData));
        reqGet.end();
    
        rl.close();
    });
}

////////////////////////////////////////////////Schedule Job for Mechine-D //////////////////////

else if ((process.argv[2] == "scheduled") || (process.argv[2] == "ScheduleD") || (process.argv[2] == "SCHEDULED")) {
    console.log("Enter date and time(in 24 hours formate) to schedule your job execution: yy,mm,dd,hh,mm");
    console.log("Example: 1993,06,10,05,00");
    rl.question('Enter time :', (time) => {
       
        var postData = { 'Time': time };
        reqGet = http.request(optionScheduleD, res => {
            console.log(`statusCode: ${res.statusCode}`);
        });
        reqGet.on('error', error => {
            console.error(error);
        });

        reqGet.write(JSON.stringify(postData));
        reqGet.end();
        rl.close();
    });
}

//////////////////////////Stop schedule job block///////////////////////

//////////////////////////////////////////Stop Machine-B //////////////////////////////
else if ((process.argv[2] == "stopb") || (process.argv[2] == "Stopb") || (process.argv[2] == "STOPB")) {
    reqGet = http.request(optionCancelB, res => {
        console.log(`statusCode: ${res.statusCode}`);
        if( res.statusCode == 200){
            console.log('Machine-B is stopped successfully !');
        }
        else if(res.statusCode == 404){
            console.log('Schedule job not found !!!');
        }
        else{
            console.log('Something went wrong !!!');
        }
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}

////////////////////////////////////////////// Stop Machine -C ////////////////////////////////
else if ((process.argv[2] == "stopc") || (process.argv[2] == "StopC") || (process.argv[2] == "STOPC")) {
        
    reqGet = http.request(optionCancelC, res => {
        console.log('statusCode:' +res.statusCode);
        if( res.statusCode == 200){
            console.log('Machine-C is stopped successfully !');
        }
        else if(res.statusCode == 404){
            console.log('Schedule job not found !!!');
        }
        else{
            console.log('Something went wrong !!!');
        }
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}

//////////////////////////////////////Stop Machine-D //////////////////////////////////////
else if ((process.argv[2] == "stopd") || (process.argv[2] = "Stopd") || (process.argv[2] == "STOPD")) {
    reqGet = http.request(optionCancelD, res => {
        console.log(`statusCode: ${res.statusCode}`);
        var check = 200;
        console.log(typeof res.statusCode);
        if( res.statusCode == check){
            console.log('Machine-D is stopped successfully');
        }
        else{
            console.log('Schedule job not found');
        }
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}
else {
    statusCode = 404;
    console.log(statusCode, ' Request not found');
}