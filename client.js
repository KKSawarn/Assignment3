const http = require('http');
const options = {
    hostname: 'localhost',
    port: 3040,
    path: '/executenow',
    method: 'GET',
}

var statusCode = null, reqGet =null;
if ((process.argv[2] == "execute") || (process.argv[2] == "Execute")|| (process.argv[2] == "EXECUTE")) {
    reqGet = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d)
        })
    })
    reqGet.on('error', error => {
        console.error(error);
    })
    reqGet.end();
}else {
    statusCode = 404;
    console.log(statusCode, ' Request not found');
}