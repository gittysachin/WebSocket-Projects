const http = require("http");
const app = require("express")();

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(9091, () => console.log("Listening on http port 9091"));

const websocketserver = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening... on 9090"));

// hashmap
const clients = {};
const games = {};

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
        console.log(result)
        
        // a user want to create a new game 
        if(result.method === "create") {
            const clientId = result.clientId;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "balls": 20,
                "clients": []
            }

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        // a client want to join
        if(result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if(game.clients.length >= 3) {
                // sorry max players reached
                return;
            }
            const color = {"0": "Red", "1": "Green", "2": "Blue"}[game.clients.length];
            game.clients.push({
                "clientId": clientId,
                "color": color
            });

            const payLoad = {
                "method": "join",
                "game": game
            }

            // loop through all clients and tell them people have joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }

        // a user plays 
        if(result.method === "play"){
            const clientId = result.clientId;
            const gameId = result.gameId;
            const ballId = result.ballId;
            const color = result.color;

            const state = games[gameId].state;
            if(!state) {
                state = {}
            }

            state[ballId] = color;
            games[gameId] = state;
        }
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