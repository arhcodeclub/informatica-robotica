class InputButton {
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

    setInputActiveValue(active) {
        this.takingInput = active;
    }
}
