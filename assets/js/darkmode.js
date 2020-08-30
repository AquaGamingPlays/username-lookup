var darkmodetoggle = localStorage.getItem('darkmode');
if (darkmodetoggle === "true") {
    darkMode();
}

function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var y = document.getElementById("dark");
    y.classList.toggle("dm1")
    var y = document.getElementById("username");
    y.classList.toggle("dm1")
    var y = document.getElementById("status");
    y.classList.toggle("dm1")
    var y = document.getElementById("uuid");
    y.classList.toggle("dm1")
    var y = document.getElementById("dark4");
    y.classList.toggle("dm1")
    var w = document.getElementById("dark5");
    w.classList.toggle("dm")
    var y = document.getElementById("dark6");
    y.classList.toggle("dm1")
    var y = document.getElementById("dark7");
    y.classList.toggle("dm1")
    var y = document.getElementById("dark8");
    y.classList.toggle("dm1")
    var y = document.getElementById("uuidcode dark9");
    y.classList.toggle("dm2")
    var y = document.getElementById("dark10");
    y.classList.toggle("dm1")
    var y = document.getElementById("dark11");
    y.classList.toggle("dm1")
    var y = document.getElementById("history");
    y.classList.toggle("dm1")
}

function dmToggle() {
    var d = localStorage.getItem('darkmode');
    if (d === "true") {
        localStorage.setItem("darkmode", "false");
    } else {
        localStorage.setItem("darkmode", "true");
    }
    darkMode()
}
