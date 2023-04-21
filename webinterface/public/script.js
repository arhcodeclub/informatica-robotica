/** global socket instance */
let socket;
/** global panel manager instance */
let panelManager;
/** global url matcher, regex */
const websocketURLMatcher = /(?:ws|wss):\/\/\w+/;

/** all robot clients currently connected to the server */
let clientCache = [];

/** matches elm.value with webSocketURLMatcher, returns 1 if it does and 0 if not*/
function indicateCorrectUrlStatus() {
    const elm = document.getElementById("addr");

    // test against regex for only one match
    let matched = elm.value.match(websocketURLMatcher);
    let success = matched && matched.length === 1;

    if (success) elm.parentElement.style.backgroundColor = "green";
    else elm.parentElement.style.backgroundColor = "red";

    return success;
}

/** updates DOM connection status element, status is of type WebSocket.readyState */
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

function onInputDataCallback(data) {
    socket.send(JSON.stringify({type: "input", data: data}));
}

function refreshClients() {

    if (socket.readyState !== WebSocket.OPEN) return;

    // clear client cache
    clientCache = [];

    // request new clients
    socket.send(JSON.stringify({type: "requestClients"}));

}

function connect(url) {
    try {

        socket = new WebSocket(url);

        updateConnectionStatus(WebSocket.CONNECTING);

        socket.addEventListener("open", e => updateConnectionStatus(e.target.readyState));
        socket.addEventListener("close", e => updateConnectionStatus(e.target.readyState));
        socket.addEventListener("error", e => updateConnectionStatus(e.target.readyState));

        socket.onmessage = (e) => {

            const data = JSON.parse(e.data);

            switch (data.type) {
                case "error": 
                    console.error(data.data);
                    break;

                case "responseClients":
                    if (!(data.data instanceof Array)) {
                        throw new Error("incoming client list not an array");
                    }

                    clientCache = data.data;

                    panelManager.refreshPanels(clientCache);

                    break;

                case "connect":
                    socket.send(JSON.stringify({type: "connect"}));

                    refreshClients();

                    break;

                case "addClient": {

                    let id = data.data;

                    panelManager.addPanel(id);

                } break;

                case "removeClient": {

                    let id = data.data;

                    panelManager.removePanel(id);

                } break;

                default: break;
            }

        };

        socket.onopen = (e) => {
            socket.send(JSON.stringify({type: "controller"}));   
        }

        socket.onclose = (e) => {
            panelManager.refreshPanels([]);
        }

    } catch(e) {}
}

/** program entrypoint (though javascript doesn't really have that :/) */
function main() {
    // PANEL MANAGER INITIALIZATION

    panelManager = new PanelManager(
        document.getElementById("button-panels-wrapper"),
        onInputDataCallback
    );


    // // refresh clients
    // socketCommunication.addCallback((e) => {

    //     if (e.type !== "message" || !e.data) return;

    //     const data = JSON.parse(e.data);

    //     if (!data.clients) return;

    //     const clients = data.clients;

    //     // for every client currently in the program, check if it still
    //     // exists on the server

    // });




    // on every button release, check if the url is following our guidelines
    // and indicate status
    const addrElm = document.getElementById("addr");
    addrElm.onkeyup = (e) => {
        let status = indicateCorrectUrlStatus();

        if (status && e.key == "Enter") {
            connect(addrElm.value);
        }
    };
    // if the connection status indicator is clicked, attempt reconnect
    document.getElementById("connection-status-wrapper").onclick = () => connect(addrElm.value);

    // initial check if the given url is correct
    // for if url is still present from reload, in which case keypress won't
    // be detected initially
    // reconnect();

    addrElm.value = location.origin.replace("http", "ws");
    indicateCorrectUrlStatus();
    connect(location.origin.replace("http", "ws"));
}

onload = main;
