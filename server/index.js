const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/build'));
app.get('/ping', (req, res) => {
    res.send("Server is working fine :)");
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});
app.listen(3003, () => {
    console.log('server started listening on port : ' + 3003);
});