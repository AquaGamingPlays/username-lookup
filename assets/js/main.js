// main.js
// main functions and api calls for username lookup
// copyright (c) tanpug 2020

// variables
var query = location.href.substring(location.href.indexOf("?lookup=") + 8); // get username that we want to look up
var ratelimitedHTML = '<br>We\'re ratelimited, so we can\'t get the creation date. Try again later.'; // code 1003 / HTTP 429
var takenHTML = 'The provided name isn\'t taken on any account.'; // code 1001
var otherAccountHTML = 'Username was on another account before, can\'t get creation date.'; // code 1002
var tooOldHTML = 'Account too old. Cannot get creation date.'; // code 1004
var serverSideHTML = 'Server-side error caught when fetching creation date. Try again later.'; // code 1005 / HTTP 5xx
var unmigratedHTML = 'Account unmigrated, unable to fetch creation date.'; // code 1006

// auto-selects searchbar
$(function() {
    $('#searchbar').focus();
});

// user info stuff
$.get("https://api.gapple.pw/cors/ashcon.php?id=" + query).done(function(data) {
    // initialize variables
    var uuid = data.uuid; // account uuid
    var username = data.username; // username
    var history = JSON.stringify(data.username_history); // name history
    var trimmedUUID = uuid.replace(/-/g, ''); // remove dashes from uuid with regex
    var capeJSON = data.textures.cape; // cape url stuff

    // update html
    document.getElementById('username').innerHTML = username;
    document.getElementById('uuidcode dark9').innerHTML = trimmedUUID;
    document.getElementById('optifine').src = 'https://optifine.net/capes/' + username + '.png'; // set the optifine cape image

    // checks if optifine cape exists
    let img = document.createElement('img');
    img.src = 'https://optifine.net/capes/' + username + '.png';
    var optifineExists = true;
    img.onerror = function() {
        document.getElementById('optifine').src = 'assets/img/notfound.png';
        optifineExists = false;
    };

    // update skin
    skinViewer.loadSkin('https://mc-heads.net/skin/' + uuid);

    // update mc cape image normally
    if (typeof capeJSON === 'undefined' || capeJSON === null) {
        document.getElementById('minecraft').src = "assets/img/notfound.png"; // no cape :(
    } else {
        var capeIdentifier = capeJSON.url.replace('http://textures.minecraft.net/texture/', ''); // just get the last part so we can feed it through proxy
        console.log(capeIdentifier);
        var httpsCapeURL = "https://api.gapple.pw/cors/textures.php?id=" + capeIdentifier;
        var capeExists = true;
        document.getElementById('minecraft').src = httpsCapeURL; // set cape image
    }

    // update skin viewer cape image
    if (capeExists === true) { // we have normal vanilla cape
        skinViewer.loadCape(httpsCapeURL);
    } else if (optifineExists === true) { // user has an optifine cape
        skinViewer.loadCape('https://api.gapple.pw/cors/optifine.php?id=' + username); // this CORS proxy doesn't error out if no cape is present, that's why we use both endpoints
    } else { // no cape :(
        skinViewer.loadCape(null);
    }

    // name history stuff
    for (var i = 0; i < data.username_history.length; i++) { // loop through name history
        if (i === 0) { // add original name
            var un = data.username_history[i].username;
            document.getElementById("history").innerHTML += '0: ' + un + ' (Original Name)' + '<br>';
        } else {
            // parse date properly
            var un = data.username_history[i].username; // username
            var cd = new Date(data.username_history[i].changed_at); // changed time
            var parsed_cd = cd.toLocaleString('en-US'); // parse the date to look pretty
            // add date and old name
            document.getElementById("history").innerHTML += [i] + ': ' + un + ' - ' + parsed_cd + '<br>';
        }
    }

    // get migration and demo status
    $.get("https://api.gapple.pw/cors/profile.php?id=" + trimmedUUID).done(function(data) {
        if (data.legacy == undefined) {
            var status = "Migrated"; // if legacy doesn't exist
        } else {
            var status = "Unmigrated"; // if legacy exists
        }
        document.getElementById('status').innerHTML = status + '<br>' + document.getElementById('status').innerHTML; // add migration status

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

// removes an element from the document
function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

// replace html from an element
function replaceHTML(elementId, HTMLToReplace) {
    var element = document.getElementById(elementId);
    element.innerHTML = element.innerHTML.replace(HTMLToReplace, '') + HTMLToReplace;
}

// remove html from an element
function removeHTML(elementId, HTMLToRemove) {
    var element = document.getElementById(elementId);
    element.innerHTML = element.innerHTML.replace(HTMLToRemove, '');
}

// finds creation date of an account
function creation(username) {
    $.get("https://api.gapple.pw/creation/date.php?name=" + username)
        .done(function(data) { // get creation date (IF THE ACCOUNT IS NOT UNMIGRATED)
            if (data.http_status_code == 200) { // we're good!
                var epoch = data.creation;
                if (epoch == 1263146631) {
                    removeHTML('status', ratelimitedHTML); // just in case
                    removeHTML('status', serverSideHTML); // just in case
                    document.getElementById('status').innerHTML += 'Created before: Jan 10, 2010 (although this is the date in Mojang\'s system)';
                } else {
                    var creaDate = new Date(epoch * 1000);
                    var parsedCreaDate = creaDate.toLocaleString('en-US'); // parse the date to look pretty
                    removeHTML('status', ratelimitedHTML); // just in case
                    removeHTML('status', serverSideHTML); // just in case
                    document.getElementById('status').innerHTML += 'Created at: ' + parsedCreaDate;
                }
                removeElement('dark11');
            }
        })
        .fail(function(data) { // there was an error (not sure why we need responseJSON for this)
            if (data.responseJSON.http_status_code == 429) { // we're ratelimited
                replaceHTML('status', ratelimitedHTML);
            } else if (data.responseJSON.http_status_code == 404) { // other error
                if (data.responseJSON.error_code == 1001) { // doesn't exist
                    document.getElementById('status').innerHTML += takenHTML;
                    removeElement('dark11');
                } else if (data.responseJSON.error_code == 1002) { // taken on another account before
                    document.getElementById('status').innerHTML += otherAccountHTML;
                    removeElement('dark11');
                } else if (data.responseJSON.error_code == 1004) { // too old
                    document.getElementById('status').innerHTML += tooOldHTML;
                    removeElement('dark11');
                } else if (data.responseJSON.error_code == 1005) { // server side issue
                    removeHTML('status', serverSideHTML);
                    document.getElementById('status').innerHTML += serverSideHTML;
                } else if (data.responseJSON.error_code == 1006) { // unmigrated
                    document.getElementById('status').innerHTML += unmigratedHTML;
                    removeElement('dark11');
                }
            } else { // server-side issue (most likely), HTTP 5xx
                replaceHTML('status', serverSideHTML);
                document.getElementById('status').innerHTML += serverSideHTML;
            }
        });
}
