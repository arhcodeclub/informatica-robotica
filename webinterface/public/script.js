class InputButton {
    element;

    keys;
    activeKeys;

    callback;

    /**
     * @param keys array of keys which activate button
     * @param callback callback functions, is given the activation status (0 or 1) as input, where 1 is activation and 0 is deactivation
     */
    constructor(element, keys, callback) {
        this.keys = keys;
        this.activeKeys = new Array(this.keys.length);
        this.element = element;

        // initialize to 0
        for (let i = 0; i < this.activeKeys.length; i++) this.activeKeys[i] = 0;

        this.callback = callback;
    }

    keyDown(e) {
        let key = e.key;

        this.keys.forEach((k, i) => {
            if (k === key) {
                this.activate();
                this.activeKeys[i] = 1;
            }
        });
    }

    keyUp(e) {
        let key = e.key;

        this.keys.forEach((k, i) => {
            if (k === key) {
                this.activeKeys[i] = 0;
                this.deactivate();
            }
        });
    }

    activate() {
        // check if this is the first time this input is activated
        for (let i = 0; i < this.activeKeys.length; i++)
            if (this.activeKeys[i]) return;

        this.callback(1);

        this.element.style.border = "rgba(255, 255, 255, 0.2) solid 2px";
    }

    deactivate() {
        // check if this is the first time this input is deactivated
        for (let i = 0; i < this.activeKeys.length; i++)
            if (this.activeKeys[i]) return;
            
        this.callback(0);

        this.element.style.border = "rgba(255, 255, 255, 1) solid 2px";
    }
}

class InputHandler {
    buttons;
    takingInput;
    inputSwitchElement;

    constructor(buttons) {
        this.buttons = buttons;
        this.takingInput = false;
        this.inputSwitchElement = document.getElementById("input-status");

        this.initialize();
    }

    initialize() {
        window.addEventListener("keydown", (e) => {
            if (!this.takingInput) return;

            this.buttons.forEach((btn) => {
                btn.keyDown(e);
            });
        });
        window.addEventListener("keyup", (e) => {
            if (!this.takingInput) return;

            this.buttons.forEach((btn) => {
                btn.keyUp(e);
            });
        });
    }

    switchInput() {
        this.takingInput = !this.takingInput;

        this.inputSwitchElement.style.backgroundColor = this.takingInput
            ? "green"
            : "red";
        this.inputSwitchElement.innerHTML = this.takingInput
            ? "taking input"
            : "not taking input";
    }
}

let socket;

function createSocket() {
    try {
        let s = new WebSocket(document.getElementById("addr").value);

        document.getElementById("address-input").style.backgroundColor =
            "green";

        s.onopen = (e) => {
            console.log("connection established");

            document.getElementById("buttonMiddle").style.backgroundColor =
                "green";
        };

        s.onmessage = (e) => {
            console.log("received: " + e.data);
        };

        s.onerror = (e) => {
            console.log("connection failed");

            document.getElementById("buttonMiddle").style.backgroundColor =
                "red";
        };

        s.onclose = (e) => {
            console.log("connection closed");

            document.getElementById("buttonMiddle").style.backgroundColor =
                "red";
        };

        return s;
    } catch (e) {
        document.getElementById("address-input").style.backgroundColor = "red";
    }
}

/** logs data to console and sends it to server */
function sendDirection(data) {
    // logging with fancy colors >_>
    console.log(
        `Direction: ${data.direction}, ` + `%c pressed: ${data.start}`,
        `color: ${data.start ? "green" : "red"}`
    );

    try {
        if (socket.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify(data));
    } catch (e) {
        return;
    }
}

/** tries to reconnect to server */
function reconnect() {
    if (
        socket &&
        socket.readyState !== WebSocket.CLOSED &&
        socket.readyState !== WebSocket.CONNECTING
    )
        return;

    document.getElementById("buttonMiddle").style.backgroundColor = "orange";

    console.log("reconnecting...");

    socket = createSocket();
}

/** program entrypoint (though javascript doesn't really have that :/) */
function main() {
    let handler = new InputHandler([
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
        new InputButton(
            document.getElementById("buttonMiddle"),
            ["r"],
            function (active) {
                if (active) reconnect();
            }
        ),
    ]);

    document.getElementById("switch-input").onclick =
        handler.switchInput.bind(handler);

    socket = createSocket();
}

onload = main;
