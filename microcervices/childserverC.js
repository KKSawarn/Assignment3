const express = require('express');
const cp = require('child_process');
const app = express();
var proces = {
    contet: "ls"
}
const port = process.env.PORT || 3031;

app.post('/executenowc', (req, res) => {
    console.log(" GET on /executenow ");

    var child = cp.spawn(proces.contet,["-lrt"]);
    child.stdout.on("data", (data) => {
        console.log(`data:\n${data}`);
        res.status(200).json("data = " + data);
    })
})
app.listen(port, () => {
    console.log(`microservices start is listining on port ${port}`);
    console.log('This is mechine : C');
})