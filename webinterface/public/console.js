const consoleDiv = document.getElementById("console");

function console_log(msg, who) {

    let parent = document.createElement("div");
    let user = document.createElement("p");
    let message = document.createElement("p");

    parent.classList.add("console-item");
    user.classList.add("console-item-user");
    message.classList.add("console-item-msg");

    message.innerHTML = msg;
    user.innerHTML = `${who} > `;

    parent.appendChild(user);
    parent.appendChild(message);

    consoleDiv.appendChild(parent);

}