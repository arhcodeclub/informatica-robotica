class ButtonPanel {
    id;

    parent;
    panelDiv;

    inputHandler;

    socketCommunicationInstance;

    manager;

    constructor(id, manager, socket) {
        this.id = id;
        this.manager = manager;
        this.parent = manager.parent;
        this.socketCommunicationInstance = socket;

        // copy global panel div
        this.panelDiv = this.parent.getElementsByClassName("initial-button-panel")[0].cloneNode(true);
        this.panelDiv.classList.remove("initial-button-panel");

        this.panelDiv.getElementsByClassName("button-name")[0].textContent = `Input #${this.id}`;

        // add to DOM
        this.parent.appendChild(this.panelDiv);

        let me = this;

        // on click, activate this panel
        this.panelDiv.onclick = () => {
            // switch input modes
            me.inputHandler.setInputActiveValue(!me.inputHandler.takingInput);

            if (me.inputHandler.takingInput) me.panelDiv.classList.add("panel-active");
            else me.panelDiv.classList.remove("panel-active");
        };

        // replace "this" with "me" because javascript's funky with the "this" object
        // ensures socketCommunicationInstance is found
        this.inputHandler = new InputHandler([
            new InputButton(
                this.panelDiv.getElementsByClassName("buttonUp")[0],
                ["w", "ArrowUp"],
                function (active) {
                    if (active) me.send({ direction: "up", start: 1 });
                    else me.send({ direction: "up", start: 0 });
                }
            ),
            new InputButton(
                this.panelDiv.getElementsByClassName("buttonDown")[0],
                ["s", "ArrowDown"],
                function (active) {
                    if (active) me.send({ direction: "down", start: 1 });
                    else me.send({ direction: "down", start: 0 });
                }
            ),
            new InputButton(
                this.panelDiv.getElementsByClassName("buttonLeft")[0],
                ["a", "ArrowLeft"],
                function (active) {
                    if (active) me.send({ direction: "left", start: 1 });
                    else me.send({ direction: "left", start: 0 });
                }
            ),
            new InputButton(
                this.panelDiv.getElementsByClassName("buttonRight")[0],
                ["d", "ArrowRight"],
                function (active) {
                    if (active) me.send({ direction: "right", start: 1 });
                    else me.send({ direction: "right", start: 0 });
                }
            ),
        ]);
    }

    send(data) {

        // inject self id in data
        data.id = this.id;

        this.socketCommunicationInstance.sendData(data);

    }
}

class PanelManager {
    nextId;

    panels;

    parent;
    socketCommunicationInstance;

    constructor(parent) {
        this.nextId = 0;
    
        this.panels = [];

        this.parent = parent;
    }

    setSocket(socket) {
        this.socketCommunicationInstance = socket;
    }

    addPanel() {
        this.panels.push(new ButtonPanel(this.nextId++, this, this.socketCommunicationInstance));
    }

    deactivateAll() {
        for (let i = 0; i < this.panels.length; i++)
            this.panels[i].inputHandler.forceQuit();
    }
}