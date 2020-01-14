const express = require('express');
const http = require('http');
const cp = require('child_process');
const app = express();

const port = process.env.PORT ||  3200 ;
var proces ={
    content : 'sudo'
}

app.use(express.json());
app.post('/restart', (req,res)=>{
    console.log("received request")
    // var ip = JSON.stringify(req.body.iP);
    // console.log(JSON.stringify(req.body.iP))
    // console.log('IP '+ ip);
    var child = cp.spawn(proces.content, ["reboot"]);
    res.status(200).send("Accepted !!!");
})

app.listen(port, ()=>{
    console.log("Listing on port number :" + port);
});
