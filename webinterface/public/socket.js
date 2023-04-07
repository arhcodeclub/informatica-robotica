const socket = new WebSocket("ws://localhost:3000/");

socket.onopen = (e) => {
    console.log("socket connection established");

    socket.send("connection established!");
}

socket.onmessage = (e) => {
    console.log("received: " + e.data);
}

socket.onerror = (e) => {
    console.error();
}