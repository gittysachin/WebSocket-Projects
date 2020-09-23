# Securing WebSockets with HAProxy

How to run the application - 

1. This (client code) code will go in the chrome console - add breakpoints before debugging (mainly on onmessage)

    ```
    let ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = message => console.log(`We received a message from server ${message.data}`)
    ws.send("Hello Server!, It's me client!")
    ```
2. This goes in debug console - 
    
    ```
    connection.send("Hello Client! It's me server!")
    ```
3. To use WebSockets with HAProxy - `haproxy -f ws.cfg`
4. In the chrome console - 
    ```
    ws = new WebSocket("ws://127.0.0.1")
    ws.onmessage = console.log
    ws.send("testing...")
    ```

    Now you can even replace it with your public IP address, something like - 
    ```
    ws = new WebSocket("ws://45.456.123.345")
    ws.onmessage = console.log
    ws.send("testing...")
    ```

    If you have a host name / domain that points to your/any IP address then - 
    ```
    ws = new WebSocket("ws://sachinwebsocketsite.ddns.net")
    ws.onmessage = console.log
    ws.send("testing...")
    ```

    To <b>secure</b> the WebSocket - 
    ```
    ws = new WebSocket("ws://sachinwebsocketsite.ddns.net")
    ws.onmessage = console.log
    ws.send("testing...")
    ```    