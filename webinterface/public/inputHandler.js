class InputButton {
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
        // only call callback when this input is engaged for the first time
        if (this.isPressed()) return;

        this.callback(1);

        this.element.classList.add("button-active");
    }

    deactivate() {
        // only call callback when this input is fully disengaged
        if (this.isPressed()) return;

        this.callback(0);

        this.element.classList.remove("button-active");
    }

    isPressed() {
        for (let i = 0; i < this.activeKeys.length; i++)
            if (this.activeKeys[i]) return 1;
        return 0;
    }

    forceQuit() {
        // check if the button was pressed
        let wasPressed = this.isPressed();

        this.keys.forEach((k, i) => {
            this.activeKeys[i] = 0;
        });
    
        if (wasPressed)
            this.deactivate();
    }
}

class InputHandler {
    buttons;
    takingInput;

    constructor(buttons) {
        this.buttons = buttons;
        this.takingInput = false;

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

    forceQuit() {
        this.buttons.forEach(btn => {
            btn.forceQuit();
        });
    }

    setInputActiveValue(active) {
        // deactivate all keys
        this.forceQuit();

        this.takingInput = active;
    }
}
