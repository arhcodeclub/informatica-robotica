const buttonUp = document.querySelector("#buttonUp");
const buttonLeft = document.getElementById("buttonLeft");
const buttonRight = document.getElementById("buttonRight");
const buttonDown = document.getElementById("buttonDown");
const buttons = [buttonUp, buttonLeft, buttonRight, buttonDown];
const directions = ["up", "left", "right", "down"];
const keys = ["w", "a", "d", "s"];
const arrows = [38, 37, 39, 40];
let stopCount = 0;
let stopSave = 1;

function sendDirection(data) {
    const XHR = new XMLHttpRequest();
    XHR.open("POST", "/action");
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.send(JSON.stringify(data));
}

function initButton(button, direction, arrow, key) {
    button.addEventListener("mousedown", function () {
        console.log(direction + ": start");

        sendDirection({
            direction,
            start: 1,
        });
    });
    button.addEventListener("mouseup", function () {
        sendDirection({
            direction,
            start: 0,
        });
        console.log(direction + ": stop");
    });
    window.addEventListener("keydown", function (e) {
        if (e.key === key || e.keyCode === arrow) {
            if (stopCount != stopSave) {
                sendDirection({
                    direction,
                    start: 1,
                });
            }
            stopSave = stopCount;
        }
    });
    window.addEventListener("keyup", function (e) {
        if (e.key === key || e.keyCode === arrow) {
            sendDirection({
                direction,
                start: 0,
            });
            stopCount++;
        }
    });
}

for (let i = 0; i < 4; i++) {
    initButton(buttons[i], directions[i], arrows[i], keys[i]);
}
