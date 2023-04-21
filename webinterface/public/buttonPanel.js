class ButtonPanel {
    id;

    parent;
    panelDiv;

    inputHandler;

    manager;

    /** 
     * @param manager parent manager
     */
    constructor(id, manager) {
        this.id = id;
        this.manager = manager;

        this.parent = manager.parent;

        // copy global panel div
        this.panelDiv = this.parent.getElementsByClassName("initial-button-panel")[0].cloneNode(true);
        this.panelDiv.classList.remove("initial-button-panel");

        this.panelDiv.getElementsByClassName("button-name")[0].textContent = `Input #${this.id}`;

        // add to DOM
        this.parent.appendChild(this.panelDiv);

        let me = this;

        // replace "this" with "me" because javascript's funky with the "this" object
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

        // on click, activate this panel
        this.panelDiv.onclick = () => {
            // switch input modes
            me.inputHandler.setInputActiveValue(!me.inputHandler.takingInput);

            if (me.inputHandler.takingInput) me.panelDiv.classList.add("panel-active");
            else me.panelDiv.classList.remove("panel-active");
        };
    }

    send(data) {
        // inject self id in data
        data.id = this.id;

        this.manager.send(data);
    }

    remove() {
        this.parent.removeChild(this.panelDiv);
    }
}

class PanelManager {
    panels;

    parent;
    dataCallback;

    constructor(parent, dataCallback) {
        this.panels = [];
        this.dataCallback = dataCallback;

        this.parent = parent;
    }

    addPanel(id) {
        // make sure no panels with this id exist yet
        for (const p of this.panels) {
            if (p.id === id) return;
        }
        
        this.panels.push(new ButtonPanel(id, this));
    }

    removePanel(id) {
        this.panels.forEach((p, i) => {
            if (p.id === id) {
                p.remove();
                this.panels.splice(i, 1);
            }
        });
    }

    deactivateAll() {
        this.panels.forEach(p => p.inputHandler.forceQuit() );
    }

    refreshPanels(serverids) {
        let clientExists = new Array(serverids.length);
        let panelsNoClient = [];

        for (let i = 0; i < this.panels.length; i++) {
            let exists = 0;

            for (let j = 0; j < serverids.length; j++) {

                if (this.panels[i].id === serverids[j]) {
                    clientExists[j] = 1;

                    exists = 1;
                }

            }

            if (!exists) panelsNoClient.push(this.panels[i].id);
        }


        // add missing panels
        for (let i = 0; i < clientExists.length; i++) {
            if (clientExists[i] === undefined) this.addPanel(serverids[i]);
        }

        // remove panels without a client
        for (let i = 0; i < panelsNoClient.length; i++) {
            this.removePanel(panelsNoClient[i]);
        }
    }

    send(data) {
        this.dataCallback(data);
    }
}