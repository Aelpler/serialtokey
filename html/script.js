const socket = io()

let config = { name: "", description: "", scriptPath: "", port: "" }

socket.on("serviceConfig", data => {
    config = JSON.parse(data)
    loadConfig()
    console.log("Received config from local server")
})

socket.on("serviceStatus", data => {
    let status = JSON.parse(data)
    let text = "Loading ..."
    if (status != "Unknown")
        text = status
    document.getElementById("serviceStatus").innerText = text
    if (status == "Installed") {
        document.getElementById("serviceStatus").classList.add("bg-success")
        document.getElementById("serviceStatus").classList.remove("bg-danger")
    }
})

socket.on("serviceLog", (data) => {
    let li = document.createElement("li")
    li.innerText = JSON.parse(data).message

    document.getElementById("ServiceLogList").appendChild(li)
})

function loadConfig() {
    document.getElementById("config-name").value = config.name
    document.getElementById("config-description").value = config.description
    document.getElementById("config-scriptPath").value = config.scriptPath
    document.getElementById("config-port").value = config.port
}


function sendConfig() {
    config.name = document.getElementById("config-name").value
    config.description = document.getElementById("config-description").value
    config.scriptPath = document.getElementById("config-scriptPath").value
    config.port = document.getElementById("config-port").value
    socket.emit("serviceConfig", JSON.stringify(config))
}

document.getElementById("config-save").addEventListener("click", sendConfig)
document.getElementById("config-reload").addEventListener("click", function () {
    socket.emit("reloadConfig", JSON.stringify(1))
})

document.getElementById("install-btn").addEventListener("click", function () {
    socket.emit("installation", JSON.stringify(1))
    console.log("Install")
})

document.getElementById("uninstall-btn").addEventListener("click", function () {
    socket.emit("installation", JSON.stringify(0))
})