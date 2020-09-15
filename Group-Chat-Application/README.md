## Scalable WebSocket Live Chat

How to run the application - 

1. `docker build -t wsapp .`
2. `docker-compose up`
3. Open a browser console and type this - 

    ```
    let ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = message => console.log(`Received: ${message.data}`);
    ws.send("Hello! I'm client 1")
    ```

4. Open multiple console windows to simulate multiple clients.
5. 
    ```
    ws.send("Hey! another messagr from another window")
    ```