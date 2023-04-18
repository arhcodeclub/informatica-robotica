let failedToConnect = false;
let socket;
const websocketURLMatcher = /(?:ws|wss):\/\/\w+/;

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

/** fetches document.getElementById('addr').value and attempts to reconnect websocket */
function reconnect() {
    let url = document.getElementById("addr").value;

    window.customData.socketCommunicationInstance.connect(url);
}

/** program entrypoint (though javascript doesn't really have that :/) */
function main() {
    // initialise custom data
    window.customData = {};

    // SOCKET INITIALIZATION

    let socketCommunication = new SocketCommunication();

    // indicate connection status
    socketCommunication.addCallback((e) => {
        updateConnectionStatus(e.srcElement.readyState);
    });

    socketCommunication.addCallback((e) => {
    
        if (e.type !== "open") return;
    
    });

    window.customData.socketCommunicationInstance = socketCommunication;

    // PANEL MANAGER INITIALIZATION

    let panelManager = new PanelManager(
        document.getElementById("button-panels-wrapper")
    );
    panelManager.setSocket(window.customData.socketCommunicationInstance);

    window.customData.panelManager = panelManager;

    // on every button release, check if the url is following our guidelines
    // and indicate status
    const addrElm = document.getElementById("addr");
    addrElm.onkeyup = (e) => {
        let status = indicateCorrectUrlStatus();

        if (status && e.key == "Enter") {
            reconnect()
        }
    };

    document.getElementById("connection-status-wrapper").onclick = () => reconnect();

    // initial check if the given url is correct
    // for if url is still present from reload, in which case keypress won't
    // be detected initially
    indicateCorrectUrlStatus();

    reconnect();
}

onload = main;
