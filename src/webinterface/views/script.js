const buttonUp = document.querySelector("#buttonUp")
const buttonLeft = document.getElementById("buttonLeft")
const buttonRight = document.getElementById("buttonRight")
const buttonDown = document.getElementById("buttonDown")



buttonUp.addEventListener("mousedown", function() {
    upStart()
})
buttonUp.addEventListener("mouseup", function() {
    upStop()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "w" || e.keyCode === 38) {
        upStart()
    }
})
window.addEventListener("keyup", function(e) {
    if (e.key === "w" || e.keyCode === 38) {
        upStop()
    }
})



buttonLeft.addEventListener("mousedown", function() {
    leftStart()
})
buttonLeft.addEventListener("mouseup", function() {
    leftStop()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "a" || e.keyCode === 37) {
        leftStart()
    }
})
window.addEventListener("keyup", function(e) {
    if (e.key === "a" || e.keyCode === 37) {
        leftStop()
    }
})



buttonRight.addEventListener("mousedown", function() {
    rightStart()
})
buttonRight.addEventListener("mouseup", function() {
    rightStop()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "d" || e.keyCode === 39) {
        rightStart()
    }
})
window.addEventListener("keyup", function(e) {
    if (e.key === "d" || e.keyCode === 39) {
        rightStop()
    }
})



buttonDown.addEventListener("mousedown", function() {
    downStart()
})
buttonDown.addEventListener("mouseup", function() {
    downStop()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "s" || e.keyCode === 40) {
        downStart()
    }
})
window.addEventListener("keyup", function(e) {
    if (e.key === "s" || e.keyCode === 40) {
        downStop()
    }
})



function upStart() {
    console.log("up: start")
    buttonUp.style.border = "rgba(255, 255, 255, 0.2) solid 2px"
    buttonUp.style.backgroundColor = "rgba(255, 255, 255, 0.1)" 
}
function upStop() {
    console.log("up: stop")
    buttonUp.style.border = "rgba(255, 255, 255, 1) solid 2px"
    buttonUp.style.backgroundColor = "rgba(0, 0, 0, 0)" 
}
function leftStart() {
    console.log("left: start")
    buttonLeft.style.border = "rgba(255, 255, 255, 0.2) solid 2px"
    buttonLeft.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
}
function leftStop() {
    console.log("left: stop")
    buttonLeft.style.border = "rgba(255, 255, 255, 1) solid 2px"
    buttonLeft.style.backgroundColor = "rgba(0, 0, 0, 0)" 
}
function rightStart() {
    console.log("right: start")
    buttonRight.style.border = "rgba(255, 255, 255, 0.2) solid 2px"
    buttonRight.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
}
function rightStop() {
    console.log("right: stop")
    buttonRight.style.border = "rgba(255, 255, 255, 1) solid 2px"
    buttonRight.style.backgroundColor = "rgba(0, 0, 0, 0)" 
}
function downStart() {
    console.log("down: start")
    buttonDown.style.border = "rgba(255, 255, 255, 0.2) solid 2px"
    buttonDown.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
}
function downStop() {
    console.log("down: stop")
    buttonDown.style.border = "rgba(255, 255, 255, 1) solid 2px"
    buttonDown.style.backgroundColor = "rgba(0, 0, 0, 0)" 
}
