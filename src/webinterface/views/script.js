const buttonUp = document.querySelector("#buttonUp")
const buttonLeft = document.getElementById("buttonLeft")
const buttonRight = document.getElementById("buttonRight")
const buttonDown = document.getElementById("buttonDown")
const buttons = [buttonUp, buttonLeft, buttonRight, buttonDown]
const direction = ["up", "left", "right", "down"]
const key = ["w", "a", "d", "s"]
const arrow = [38, 37, 39, 40]
let stopCount = 0
let stopSave = 1

for (let i = 0; i < 4; i++) {
    buttons[i].addEventListener("mousedown", function() {
        console.log(direction[i] + ": start")
        buttons[i].style.border = "rgba(255, 255, 255, 0.2) solid 2px"
        buttons[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)"
    })
    buttons[i].addEventListener("mouseup", function() {
        console.log(direction[i] + ": stop")
        buttons[i].style.border = "rgba(255, 255, 255, 1) solid 2px"
        buttons[i].addEventListener("mouseover", function() {
            buttons[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)"
        })
        buttons[i].addEventListener("mouseout", function() {
            buttons[i].style.backgroundColor = "rgba(0, 0, 0, 0)"
        })
    })
    window.addEventListener("keydown", function(e) {
        if (e.key === key[i] || e.keyCode === arrow[i]) {
            if (stopCount != stopSave) {
                console.log(direction[i] + ": start")
                buttons[i].style.border = "rgba(255, 255, 255, 0.2) solid 2px"
                buttons[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)"
            }
            stopSave = stopCount
        }
    })
    window.addEventListener("keyup", function(e) {
        if (e.key === key[i] || e.keyCode === arrow[i]) {
            console.log(direction[i] + ": stop")
            buttons[i].style.border = "rgba(255, 255, 255, 1) solid 2px"
            buttons[i].style.backgroundColor = "rgba(0, 0, 0, 0)"
            stopCount++
        }
    })
}
