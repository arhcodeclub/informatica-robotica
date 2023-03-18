const buttonUp = document.querySelector("#buttonUp")
const buttonLeft = document.getElementById("buttonLeft")
const buttonRight = document.getElementById("buttonRight")
const buttonDown = document.getElementById("buttonDown")

buttonUp.addEventListener("click", function() {
    up()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "w" || e.keyCode === 38) {
        up()
    }
})

buttonLeft.addEventListener("click", function() {
    left()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "a" || e.keyCode === 37) {
        left()
    }
})

buttonRight.addEventListener("click", function() {
    right()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "d" || e.keyCode === 39) {
        right()
    }
})

buttonDown.addEventListener("click", function() {
    down()
})
window.addEventListener("keydown", function(e) {
    if (e.key === "s" || e.keyCode === 40) {
        down()
    }
})

function up() {
    console.log("up")
}
function left() {
    console.log("left")
}
function right() {
    console.log("right")
}
function down() {
    console.log("down")
}
