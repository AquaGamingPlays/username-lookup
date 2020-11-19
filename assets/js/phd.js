// phd.js
// copyright (c) tanpug 2020

// user info stuff
if (query == undefined) {} else {
    removeElement('alertbox'); // get rid of the alert
    new_html = '<div class="container" style="text-align:center"><div class="row" style="text-align:center"><div class="col-sm-2"></div><div id="userbox" class="col-sm-4"><h3>User Info</h3><ul id="dark" class="list-group" style="text-align:center"><li id="username" class="list-group-item"></li><li id="status" class="list-group-item"></li><li id="uuid" class="list-group-item"><code id="uuidcode dark9"></code></li><li id="history" class="list-group-item"></li></ul></div><div id="capebox" class="col-sm-4"><h3>Cape Info</h3><ul id="dark6" class="list-group" style="text-align:center"><li id="dark8" class="list-group-item">OptiFine Cape<br/><img id="optifine" width="92" height="44"></li></ul></div><div class="col-sm-2"></div></div></div>';
    // ^^^^^^ add new html for the actual skin viewer, user info, cape info etc
    document.getElementById('bodybox').innerHTML += new_html; // add the new html
    var darkmodetoggle = localStorage.getItem('darkmode'); // check if we have dark mode toggled
    if (darkmodetoggle === "true") {
        darkMode_newHTML(); // we need to toggle dark mode for the new HTML separately since we're injecting it after main.js has loaded.
    }
    $.get("https://phdcheck.mcapi.workers.dev/uuid/" + query).done(function(data) {
        // initialize variables
        var uuid = data.uuid; // account uuid
        var username = data.username; // username
        var history = JSON.stringify(data.name_history); // name history
        var trimmedUUID = uuid.replace(/-/g, ''); // remove dashes from uuid with regex

        // discord embed stuff
        document.getElementById("description").content = 'View the results for the user ' + username + '!';
        document.getElementById("og_description").content = 'View the results for the user ' + username + '!';
        document.getElementById("og_url").content = 'https://lookup.tanpug.rocks/?lookup=' + query;

        // update html
        document.getElementById('username').innerHTML = username;
        document.getElementById('uuidcode dark9').innerHTML = trimmedUUID;

        // migration status checks
        if (data.legacy == undefined) {
            var status = "Migrated"; // if legacy doesn't exist
        } else {
            var status = "Unmigrated"; // if legacy exists
        }
        document.getElementById('status').innerHTML = status + '<br>' + document.getElementById('status').innerHTML; // add migration status

        // checks if optifine cape exists
        let img = document.createElement('img');
        img.src = 'https://optifine.net/capes/' + username + '.png';
        var optifineExists = true;
        img.onerror = function() {
            document.getElementById('optifine').src = 'assets/img/notfound.png';
            optifineExists = false;
        };
        if (optifineExists === true) {
            document.getElementById('optifine').src = 'https://optifine.net/capes/' + username + '.png'; // set the optifine cape image
        }

        // name history stuff
        for (var i = data.name_history.length - 1; i >= 0; i--) { // loop through name history (REVERSED)
            if (i === 0) { // add original name
                var un = data.name_history[i].name;
                document.getElementById("history").innerHTML += '[<b>0</b>]: ' + un + ' (Original Name)' + '<br>';
            } else {
                // parse date properly
                var un = data.name_history[i].name; // username
                var cd = new Date(data.name_history[i].changedToAt); // changed time
                var parsed_cd = cd.toLocaleString('en-US'); // parse the date to look pretty
                // add date and old name
                document.getElementById("history").innerHTML += '[<b>' + [i] + '</b>]' + ': ' + un + ' - ' + parsed_cd + '<br>';
            }
        }

        // get demo status
        $.get("https://api.gapple.pw/cors/profile/" + trimmedUUID).done(function(data) {
            if (status === "Unmigrated") {
                if (data.demo == undefined) { // nothing lol
                } else {
                    var demo = "Demo"; // if demo exists
                    document.getElementById('status').innerHTML = "Unmigrated + " + demo; // add demo status
                }
            } else {
                document.getElementById('dark11').style.display = '';
            }
        });
    });
}
