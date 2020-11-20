// lookup.js
// copyright (c) tanpug 2020

// user info stuff
if (query == undefined) {} else {
    $.get("https://blockcheck.mcapi.workers.dev/name/" + query).done(function(data) {
        if (data.status == "blocked") { // if the name is blocked
            var alert_mode = "alert-warning"
            var name_status = '<p>The username ' + query + ' is currently blocked.<br>Usernames can be blocked by username snipers or via an API request (unless the person who blocked the name re-blocks it, it will only be blocked for 24 hours).<br>Usernames can also be permanently blocked by Mojang\'s username filter.<br>Usernames can also <i>appear</i> blocked if they are pseudo-hard-deleted, but you can\'t check if this is the case unless you have the account\'s UUID.</p>'; // if name is blocked
        } else if (data.status == "available") { // if the name is available
            var alert_mode = "alert-success"
            var name_status = '<p>The username ' + query + ' is available and ready to claim!</p>'; // if name is available
        } else if (data.status == "soon") { // if the name is dropping
            var alert_mode = "alert-primary"
            var drop_time = new Date(data.drop_time);
            var parsed_dt = drop_time.toLocaleString('en-US');
            var name_status = '<p>The username ' + query + ' is currently dropping!<br>The username will be available on <b>' + parsed_dt + '</b>.<br>Get your snipers ready! Try <a href="https://github.com/Kqzz/MCsniperPY" target="_blank">MCSniperPY</a> if you don\'t have a sniper yet!</p>'; // if name is dropping
        } else if (data.status == "taken") { // if the name is taken
            removeElement('alertbox'); // get rid of the alert
            new_html = '<div class="container" style="text-align:center"><div class="row" style="text-align:center"><div id="skinbox" class="col-sm-4" style="text-align:center"><h3>Skin</h3><div id="skin_container" width="180" height="433"></div><button class="btn btn-primary btn-sm" id="dark10" onClick="(walk.paused = !walk.paused)">Pause</button></div><div id="userbox" class="col-sm-4"><h3>User Info</h3><ul id="dark" class="list-group" style="text-align:center"><li id="username" class="list-group-item"></li><li id="status" class="list-group-item"><!-- <button class="btn btn-primary btn-sm" id="dark11" onClick="creation(document.getElementById(\'username\').innerHTML)" style="display: none;">Find Creation Date</button> !--></li><li id="uuid" class="list-group-item"><code id="uuidcode dark9"></code></li><li id="history" class="list-group-item"></li></ul></div><div id="capebox" class="col-sm-4"><h3>Cape Info</h3><ul id="dark6" class="list-group" style="text-align:center"><li id="dark7" class="list-group-item">Minecraft Cape<br/><img id="minecraft" width="92" height="44"></li><li id="dark8" class="list-group-item">OptiFine Cape<br/><img id="optifine" width="92" height="44"></li></ul></div></div></div>';
            // ^^^^^^ add new html for the actual skin viewer, user info, cape info etc
            document.getElementById('bodybox').innerHTML += new_html; // add the new html
            init_skinViewer(); // create the skinViewer object
            var darkmodetoggle = localStorage.getItem('darkmode'); // check if we have dark mode toggled
            if (darkmodetoggle === "true") {
                darkMode_newHTML(); // we need to toggle dark mode for the new HTML separately since we're injecting it after main.js has loaded.
            }
            $.get("https://api.ashcon.app/mojang/v2/user/" + query).done(function(data) {
                // initialize variables
                var uuid = data.uuid; // account uuid
                var username = data.username; // username
                var history = JSON.stringify(data.username_history); // name history
                var trimmedUUID = uuid.replace(/-/g, ''); // remove dashes from uuid with regex
                var capeJSON = data.textures.cape; // cape url stuff
                var skinURL = data.textures.skin.url; // the skin url (no more mc-heads)

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

                // update skin
                if (skinURL.includes("http://assets.mojang.com/SkinTemplates/") === true) { // default skins, different URL
                    var skinModel = skinURL.replace("http://assets.mojang.com/SkinTemplates/", "").replace(".png", "");
                    if (skinModel === "alex") {
                        var skinIdentifier = "3b60a1f6d562f52aaebbf1434f1de147933a3affe0e764fa49ea057536623cd3"; // alex texture ID
                    } else {
                        var skinIdentifier = "1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b"; // steve texture ID
                    }
                } else { // normal URL
                    var skinIdentifier = skinURL.replace("http://textures.minecraft.net/texture/", ""); // just get the last part so we can feed it through proxy
                }
                skinURL = "https://api.gapple.pw/cors/textures/" + skinIdentifier;
                skinViewer.loadSkin(skinURL); // load the skin

                // update mc cape image normally
                if (typeof capeJSON === 'undefined' || capeJSON === null) {
                    document.getElementById('minecraft').src = "assets/img/notfound.png"; // no cape :(
                } else {
                    var capeIdentifier = capeJSON.url.replace("http://textures.minecraft.net/texture/", ""); // just get the last part so we can feed it through proxy
                    var httpsCapeURL = "https://api.gapple.pw/cors/textures/" + capeIdentifier;
                    var capeExists = true;
                    document.getElementById('minecraft').src = httpsCapeURL; // set cape image
                }

                // update skin viewer cape image
                if (capeExists === true) { // we have normal vanilla cape
                    skinViewer.loadCape(httpsCapeURL);
                } else if (optifineExists === true) { // user has an optifine cape
                    skinViewer.loadCape('https://api.gapple.pw/cors/optifine/' + username); // this CORS proxy doesn't error out if no cape is present, that's why we use both endpoints
                } else { // no cape :(
                    skinViewer.loadCape(null);
                }

                // name history stuff
                for (var i = data.username_history.length - 1; i >= 0; i--) { // loop through name history (REVERSED)
                    if (i === 0) { // add original name
                        var un = data.username_history[i].username;
                        document.getElementById("history").innerHTML += '[<b>0</b>]: ' + un + ' (Original Name)' + '<br>';
                    } else {
                        // parse date properly
                        var un = data.username_history[i].username; // username
                        var cd = new Date(data.username_history[i].changed_at); // changed time
                        var parsed_cd = cd.toLocaleString('en-US'); // parse the date to look pretty
                        // add date and old name
                        document.getElementById("history").innerHTML += '[<b>' + [i] + '</b>]' + ': ' + un + ' - ' + parsed_cd + '<br>';
                    }
                }

                // ashcon creation dates
                if (data.created_at == undefined) { // nothing lol
                } else {
                    if (data.created_at != null) { // not unmigrated
                        document.getElementById('status').innerHTML += '<text data-toggle="tooltip" data-placement="top" data-html="true" title="<b>Creation dates are inaccurate for a lot of accounts due to a breaking change on Mojang\'s end. We are currently fetching dates from Ashcon\'s API. Please yell at Mojang (WEB-3367) in order for accurate creation dates to return.</b>">Created at: ' + data.created_at + '</text>';
                        $('[data-toggle="tooltip"]').tooltip()
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

            // finds creation date of an account
            // this code will be kept here since there's a chance WEB-3367 will be fixed
            function creation(username) {
                removeElement('dark11');
                document.getElementById('status').innerHTML += 'Loading...';
                $.get("https://api.gapple.pw/creation/" + username)
                    .done(function(data) { // get creation date (IF THE ACCOUNT IS NOT UNMIGRATED)
                        document.getElementById('status').innerHTML = document.getElementById('status').innerHTML.replace('Loading...', '');
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
                        }
                    })
                    .fail(function(data) { // there was an error (not sure why we need responseJSON for this)
                        document.getElementById('status').innerHTML = document.getElementById('status').innerHTML.replace('Loading...', '');
                        if (data.responseJSON.http_status_code == 429) { // we're ratelimited
                            replaceHTML('status', ratelimitedHTML);
                            document.getElementById('status').innerHTML += '<button class="btn btn-primary btn-sm" id="dark11" onClick="creation(document.getElementById(\'username\').innerHTML)" style="display: none;">Find Creation Date</button>'
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
        }
        // replace the alert info with new content based on what error we encountered
        var w = document.getElementById("alertbox");
        w.classList.toggle("alert-secondary")
        w.classList.toggle(alert_mode)
        document.getElementById('alertbox').innerHTML = '<h4 class="alert-heading">' + query + '</h4>' + name_status;
    });
}
