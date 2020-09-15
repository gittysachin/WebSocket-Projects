const http = require("http");
const app = require("express")();

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(9091, () => console.log("Listening on http port 9091"));

const websocketserver = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening... on 9090"));

// hashmap
const clients = {};

const wsServer = new websocketserver({
    "httpServer": httpServer
});

wsServer.on("request", request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("OPENED!"));
    connection.on("close", () => console.log("CLOSED!"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data); // this will fail if clients are not sending message as JSON 😊
        // I have recieved a message from the client
        console.log(result);
    });

    // generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    }

    // response
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }

    // send back the client connect
    connection.send(JSON.stringify(payLoad));
});

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();