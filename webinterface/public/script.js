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

let serverAvailable = false;

function setButtonPressedCss(button, isPressed) {
    if (isPressed) button.style.border = "rgba(255, 255, 255, 0.2) solid 2px";
    else button.style.border = "rgba(255, 255, 255, 1) solid 2px";
}

function sendDataToServer(data) {
    const request = new XMLHttpRequest();
    request.open("POST", "/action");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            // console.log(request.response);
        }
    }
}

// better name needed, called when button is activated
function sendDirection(data) {
    console.log(
        `Direction: ${data.direction}, ` + `%c pressed: ${data.start}`,
        `color: ${data.start ? "green" : "red"}`
    );

    sendDataToServer(data);
}

function initButton(button, direction, arrow, key) {
    button.addEventListener("mousedown", function () {
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
        setButtonPressedCss(button, 0);
    });
    window.addEventListener("keydown", function (e) {
        if (e.key === key || e.keyCode === arrow) {
            if (stopCount != stopSave) {
                sendDirection({
                    direction,
                    start: 1,
                });
            }
            setButtonPressedCss(button, 1);
            stopSave = stopCount;
        }
    });
    window.addEventListener("keyup", function (e) {
        if (e.key === key || e.keyCode === arrow) {
            sendDirection({
                direction,
                start: 0,
            });
            setButtonPressedCss(button, 0);
            stopCount++;
        }
    });
}

for (let i = 0; i < 4; i++) {
    initButton(buttons[i], directions[i], arrows[i], keys[i]);
}
