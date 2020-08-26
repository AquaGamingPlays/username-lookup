// main.js
// main functions and api calls for username lookup
// copyright (c) tanpug 2020

// auto-selects searchbar
$(function()
{
    $('#searchbar').focus();
});

var query = location.href.substring(location.href.indexOf("?lookup=") + 8); // get username that we want to look up

// user info stuff
$.get("https://api.gapple.pw/cors/ashcon.php?id=" + query).done(function(data) {
    // initialize variables
    var uuid = data.uuid;
    var username = data.username;
    var history = JSON.stringify(data.username_history);
    var trimmedUUID = uuid.replace(/-/g, ''); // remove dashes from uuid with regex
    var capeJSON = data.textures.cape; // cape url stuff
    var creaDate = data.created_at;
    
    // update html
    document.getElementById('username').innerHTML = username;
    document.getElementById('uuidcode dark9').innerHTML = trimmedUUID;
    document.getElementById('optifine').src = 'https://optifine.net/capes/' + username + '.png';

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
    //document.getElementById('face').src = 'https://mc-heads.net/avatar/' + uuid; // update face
    
    // update mc cape image normally
    if (typeof capeJSON === 'undefined' || capeJSON === null) {
        document.getElementById('minecraft').src = "assets/img/notfound.png";
    } else {
    	var capeIdentifier = capeJSON.url.replace('http://textures.minecraft.net/texture/', '');
        console.log(capeIdentifier);
        var httpsCapeURL = "https://api.gapple.pw/cors/textures.php?id=" + capeIdentifier;
        var capeExists = true;
        document.getElementById('minecraft').src = httpsCapeURL;
    }

    // update skin viewer cape image
    if (capeExists === true) { // we have normal vanilla cape
        skinViewer.loadCape(httpsCapeURL);
    }
    else if (optifineExists === true) { // user has an optifine cape
        skinViewer.loadCape('https://api.gapple.pw/cors/optifine.php?id=' + username); // this CORS proxy doesn't error out if no cape is present, that's why we use both endpoints
    }
    else { // no cape :(
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
            var cd = data.username_history[i].changed_at; // changed time
            var yr = cd.substring(0, 4);
            var mnth = cd.substring(5, 7);
            var dy = cd.substring(8, 10);
            var tme = cd.substring(11, 19);

            if (mnth === "01") {
                var mnth = "Jan";
            }
            if (mnth === "02") {
                var mnth = "Feb";
            }
            if (mnth === "03") {
                var mnth = "Mar";
            }
            if (mnth === "04") {
                var mnth = "Apr";
            }
            if (mnth === "05") {
                var mnth = "May";
            }
            if (mnth === "06") {
                var mnth = "Jun";
            }
            if (mnth === "07") {
                var mnth = "Jul";
            }
            if (mnth === "08") {
                var mnth = "Aug";
            }
            if (mnth === "09") {
                var mnth = "Sep";
            }
            if (mnth === "10") {
                var mnth = "Oct";
            }
            if (mnth === "11") {
                var mnth = "Nov";
            }
            if (mnth === "12") {
                var mnth = "Dec";
            }
            if (dy === "01") {
                var dy = "1";
            }
            if (dy === "02") {
                var dy = "2";
            }
            if (dy === "03") {
                var dy = "3";
            }
            if (dy === "04") {
                var dy = "4";
            }
            if (dy === "05") {
                var dy = "5";
            }
            if (dy === "06") {
                var dy = "6";
            }
            if (dy === "07") {
                var dy = "7";
            }
            if (dy === "08") {
                var dy = "8";
            }
            if (dy === "09") {
                var dy = "9";
            }

            // add date and old name
            document.getElementById("history").innerHTML += [i] + ': ' + un + ' - ' + mnth + " " + dy + ', ' + yr + ', ' + tme + ' UTC' + '<br>';
        }
    }

    // get migration and demo status
    $.get("https://api.gapple.pw/cors/profile.php?id=" + trimmedUUID).done(function(data) {
        if (data.legacy == undefined) {
            var status = "Migrated"; // if legacy doesn't exist
        } else {
            var status = "Unmigrated"; // if legacy exists
        }
        document.getElementById('status').innerHTML = status; // add migration status

        if (status === "Unmigrated") {
        	if (data.demo == undefined) {

        	} else {
            var demo = "Demo"; // if demo exists
            document.getElementById('status').innerHTML = "Unmigrated + " + demo; // add demo status
        	}
    	}
    	    if (typeof creaDate === 'undefined' || creaDate === null) {

    		} else {
    		document.getElementById('status').innerHTML += '<br>' + 'Created at: ' + creaDate;
   			}  
    });
});

