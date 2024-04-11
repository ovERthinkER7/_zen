const express = require("express");
const server = express();
const portNo = process.env.PORT || 8000;

server.all(`/`, (req, res) => {
    res.send(`Please connect me to a hosting website in-order to work 24/7.`);
});

function keepAlive() {
    server.listen(portNo, () => {
        console.log(`on`);
    });
}

module.exports = keepAlive;
