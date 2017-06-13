const express = require('express');
const app = express();

app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

var server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(server.address());
    console.log("Server is listening at http://localhost:%s", port);
});