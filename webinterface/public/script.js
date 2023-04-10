let failedToConnect = false;
let socket;
const websocketURLMatcher = /(?:ws|wss):\/\/\w+/;

/** matches elm.value with webSocketURLMatcher, returns 1 if it does and 0 if not*/
function indicateCorrectUrlStatus() {
    const elm = document.getElementById("addr");

    let matched = elm.value.match(websocketURLMatcher);
    let success = !(!matched || matched.length > 1);

    if (success) elm.parentElement.style.backgroundColor = "green";
    else elm.parentElement.style.backgroundColor = "red";

    return success;
}

function setInputActive(active) {
    window.handler.setInputActiveValue(active);

    const border = active ? "5px solid rgb(42,88,42)" : "";

    document.getElementById("button-wrapper").style.border = border;
}

function updateConnectionStatus(status) {
    const elm = document.getElementById("connection-status"),
        color = document.getElementById("connection-status-icon");

    switch (status) {
        case WebSocket.OPEN:
            elm.innerHTML = "connected";
            color.style.backgroundColor = "green";

            break;

        case WebSocket.CLOSED:
            elm.innerHTML = "disconnected";
            color.style.backgroundColor = "red";

            break;

        case WebSocket.CONNECTING:
            elm.innerHTML = "connecting";
            color.style.backgroundColor = "orange";

            break;

        default:
            break;
    }
}

/** initializes socket connection */
function initSocket(url) {
    socket = new WebSocket(url);

    socket.onopen = (e) => {
        console.log("connection established");

        updateConnectionStatus(socket.readyState);
    };

    socket.onmessage = (e) => {
        console.log("received: " + e.data);
    };

    socket.onerror = (e) => {
        console.log("connection failed");

        updateConnectionStatus(socket.readyState);

        setInputActive(0);
    };

    socket.onclose = (e) => {
        console.log("connection closed");

        updateConnectionStatus(socket.readyState);

        setInputActive(0);
    };

    updateConnectionStatus(socket.readyState);
}

/** logs data to console and sends it to server */
function sendDirection(data) {
    if (!socket) return;

    // check if data can be sent to socket
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(data));

    // logging with fancy colors >_>
    // console.log(
    //     `Direction: ${data.direction}, ` + `%c pressed: ${data.start}`,
    //     `color: ${data.start ? "green" : "red"}`
    // );
}

/** tries to reconnect to server */
function reconnect() {
    // on reconnect, stop taking input
    setInputActive(0);

    console.log("connecting...");

    // initialize socket with url from url bar
    initSocket(document.getElementById("addr").value);
}

/** program entrypoint (though javascript doesn't really have that :/) */
function main() {
    window.handler = new InputHandler([
        new InputButton(
            document.getElementById("buttonUp"),
            ["w", "ArrowUp"],
            function (active) {
                if (active) sendDirection({ direction: "up", start: 1 });
                else sendDirection({ direction: "up", start: 0 });
            }
        ),
        new InputButton(
            document.getElementById("buttonDown"),
            ["s", "ArrowDown"],
            function (active) {
                if (active) sendDirection({ direction: "down", start: 1 });
                else sendDirection({ direction: "down", start: 0 });
            }
        ),
        new InputButton(
            document.getElementById("buttonLeft"),
            ["a", "ArrowLeft"],
            function (active) {
                if (active) sendDirection({ direction: "left", start: 1 });
                else sendDirection({ direction: "left", start: 0 });
            }
        ),
        new InputButton(
            document.getElementById("buttonRight"),
            ["d", "ArrowRight"],
            function (active) {
                if (active) sendDirection({ direction: "right", start: 1 });
                else sendDirection({ direction: "right", start: 0 });
            }
        ),
    ]);

    // on every button release, check if the url is following our guidelines
    // and indicate status
    const addrElm = document.getElementById("addr");
    addrElm.onkeyup = (e) => {
        let status = indicateCorrectUrlStatus();

        if (status && e.key == "Enter") {
            reconnect();
        }
    };

    // initial check if the given url is correct
    // for if url is still present from reload, in which case keypress won't
    // be detected initially
    indicateCorrectUrlStatus();

    // indicate if input is being taken or not
    document.getElementById("button-wrapper").onclick = (e) => {
        if (!socket) return;

        if (socket.readyState !== WebSocket.OPEN) return;

        // reverse current input setting
        setInputActive(!window.handler.takingInput);
    };
}

onload = main;
