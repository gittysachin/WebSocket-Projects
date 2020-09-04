const http = require("http");
const WebSocketServer = require("websocket").server;
let connection = null;

const httpserver = http.createServer((req, res) => {
    
    console.log("We have received a request!");
});

const websocket = new WebSocketServer({
    "httpServer": httpserver
});

websocket.on("request", request => {
    connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("OPENED!!!"));
    connection.on("close", () => console.log("CLOSED!!!"));
    connection.on("message", message => {
        
        console.log(`Received message: ${message.utf8Data}`);
    });
    
    sendEvery5seconds();
    // connection.send("Hello Client! It's me server!");
});

httpserver.listen(8080, () => { console.log("My server is listening on port 8080") });

function sendEvery5seconds(){
    connection.send(`Message ${Math.random()}`);

    setTimeout(sendEvery5seconds, 5000);
}

// This code will go in the chrome console - add breakpoints before debugging (mainly on onmessage)

// let ws = new WebSocket("ws://localhost:8080")
// ws.onmessage = message => console.log(`We received a message from server ${message.data}`)
// ws.send("Hello Server!, It's me client!")

// connection.send("Hello Client! It's me server!");  // this goes in debug console