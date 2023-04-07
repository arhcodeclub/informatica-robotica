class KeyboardInputContainer {
    key;
    isPressed;

    /**
     * @param key The key with which this button activates
     */
    constructor(key) {
        this.key = key;

        this.isPressed = false;
    }

    press() {
        this.isPressed = true;
    }

    unpress() {
        this.isPressed = false;
    }
}

class CarInput {
    keyboardInputs;
    element;
    activateCallback;
    deactivateCallback;

    isPressed;
    isClicked;

    /**
     * @param element HTMLElement to bind to
     * @param keys Array of keys that should activate this button
     * @param activateCallback Callback function called on activation
     * @param deactivateCallback Callback function called on deactivation
     */
    constructor(element, keys, activateCallback, deactivateCallback) {
        this.element = element;
        this.activateCallback = activateCallback;
        this.deactivateCallback = deactivateCallback;

        this.keyboardInputs = [];

        keys.forEach((element) => {
            this.keyboardInputs.push(new KeyboardInputContainer(element));
        });

        this.isClicked = false;

        this.initialize();
    }

    setStyle(isActive) {
        if (isActive)
            this.element.style.border = "rgba(255, 255, 255, 0.2) solid 2px";
        else this.element.style.border = "rgba(255, 255, 255, 1) solid 2px";
    }

    activate() {
        if (this.isPressed || this.isClicked) return;

        this.setStyle(1);

        try {
            this.activateCallback();
        } catch (e) {}
    }

    deactivate() {
        if (this.isPressed || this.isClicked) return;

        this.setStyle(0);

        try {
            this.deactivateCallback();
        } catch (e) {}
    }

    _click() {
        this.activate();

        this.isClicked = true;
    }

    _unclick() {
        this.isClicked = false;

        this.deactivate();
    }

    _press(e) {
        let key = e.key;

        this.keyboardInputs.forEach((kinput) => {
            if (kinput.isPressed) return;

            if (key === kinput.key) {
                kinput.press();

                this.activate();

                this.isPressed = true;

                return;
            }
        });
    }

    _unpress(e) {
        let key = e.key;

        let pressed = 0,
            isMine = false;

        this.keyboardInputs.forEach((kinput) => {
            if (key === kinput.key) {
                kinput.unpress();

                isMine = true;
            } else if (kinput.isPressed) pressed++;
        });

        if (isMine && !pressed) {
            this.isPressed = false;

            this.deactivate();
        }
    }

    /* attaches listeners to this.element */
    initialize() {
        this.element.addEventListener("mousedown", this._click.bind(this));
        this.element.addEventListener("mouseup", this._unclick.bind(this));

        document.addEventListener("keydown", this._press.bind(this));
        document.addEventListener("keyup", this._unpress.bind(this));
    }
}

let socket;

function createSocket() {
    let s = new WebSocket("ws://localhost:3000/");

    s.onopen = (e) => {
        console.log("connection established");

        document.getElementById("buttonMiddle").style.backgroundColor = "green";
    };

    s.onmessage = (e) => {
        console.log("received: " + e.data);
    };

    s.onerror = (e) => {
        console.log("connection failed");

        document.getElementById("buttonMiddle").style.backgroundColor = "red";
    };

    s.onclose = (e) => {
        console.log("connection closed");

        document.getElementById("buttonMiddle").style.backgroundColor = "red";
    };

    return s;
}

/** logs data to console and sends it to server */
function sendDirection(data) {
    // logging with fancy colors >_>
    console.log(
        `Direction: ${data.direction}, ` + `%c pressed: ${data.start}`,
        `color: ${data.start ? "green" : "red"}`
    );

    socket.send(JSON.stringify(data));
}

function reconnect() {
    if (
        socket.readyState !== WebSocket.CLOSED &&
        socket.readyState !== WebSocket.CONNECTING
    )
        return;

    console.log("reconnecting...");

    socket = createSocket();
}

/** program entrypoint (though javascript doesn't really have that :/) */
function main() {
    new CarInput(
        document.getElementById("buttonUp"),
        ["w", "ArrowUp"],
        () => {
            sendDirection({ direction: "up", start: 1 });
        },
        () => {
            sendDirection({ direction: "up", start: 0 });
        }
    );
    new CarInput(
        document.getElementById("buttonDown"),
        ["s", "ArrowDown"],
        () => {
            sendDirection({ direction: "down", start: 1 });
        },
        () => {
            sendDirection({ direction: "down", start: 0 });
        }
    );
    new CarInput(
        document.getElementById("buttonLeft"),
        ["a", "ArrowLeft"],
        () => {
            sendDirection({ direction: "left", start: 1 });
        },
        () => {
            sendDirection({ direction: "left", start: 0 });
        }
    );
    new CarInput(
        document.getElementById("buttonRight"),
        ["d", "ArrowRight"],
        () => {
            sendDirection({ direction: "right", start: 1 });
        },
        () => {
            sendDirection({ direction: "right", start: 0 });
        }
    );
    new CarInput(
        document.getElementById("buttonMiddle"),
        ["r"],
        () => {
            reconnect();
        },
        () => {
            return;
        }
    );

    socket = createSocket();
}

onload = main;
