function darkMode() {
    try {
        var element = document.body;
        element.classList.toggle("dark-mode");
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("dark4");
        y.classList.toggle("dm1")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var w = document.getElementById("dark5");
        w.classList.toggle("dm")
        w.classList.toggle("navbar-dark")
        w.classList.toggle("navbar-light")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    if (document.getElementById('dark11') == null) {} else {
        try {
            var y = document.getElementById("dark11");
            y.classList.toggle("dm1")
        } catch (err) {
            console.log("error toggling dark mode for a class")
        }
    }
}

function darkMode_newHTML() {
    try {
        var y = document.getElementById("dark");
        y.classList.toggle("dm1")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("username");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("status");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("uuid");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("history");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("dark6");
        y.classList.toggle("dm1")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("dark7");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("dark8");
        y.classList.toggle("list-dm")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("uuidcode dark9");
        y.classList.toggle("dm2")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
    try {
        var y = document.getElementById("dark10");
        y.classList.toggle("dm1")
    } catch (err) {
        console.log("error toggling dark mode for a class")
    }
}

function dmToggle() {
    var d = localStorage.getItem('darkmode');
    if (d === "true") {
        localStorage.setItem("darkmode", "false");
    } else {
        localStorage.setItem("darkmode", "true");
    }
    darkMode()
    darkMode_newHTML()
}
