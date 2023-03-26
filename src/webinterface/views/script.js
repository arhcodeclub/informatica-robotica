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
}
function upStop() {
    console.log("up: stop")
}
function leftStart() {
    console.log("left: start")
}
function leftStop() {
    console.log("left: stop")
}
function rightStart() {
    console.log("right: start")
}
function rightStop() {
    console.log("right: stop")
}
function downStart() {
    console.log("down: start")
}
function downStop() {
    console.log("down: stop")
}
