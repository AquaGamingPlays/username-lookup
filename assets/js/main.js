// main.js
// copyright (c) tanpug 2020

// variables
if (location.href.includes("?lookup=")) {
    var query = location.href.substring(location.href.indexOf("?lookup=") + 8); // get username that we want to look up
} else {
    var query = undefined;
}
var ratelimitedHTML = '<br>We\'re ratelimited, so we can\'t get the creation date. Try again later.'; // code 1003 / HTTP 429
var takenHTML = 'The provided name isn\'t taken on any account.'; // code 1001
var otherAccountHTML = 'Username was on another account or on the same account multiple times, can\'t get creation date.'; // code 1002
var tooOldHTML = 'Account too old. Cannot get creation date.'; // code 1004
var serverSideHTML = 'Server-side error caught when fetching creation date. Try again later.'; // code 1005 / HTTP 5xx
var unmigratedHTML = 'Account unmigrated, unable to fetch creation date.'; // code 1006

// auto-selects searchbar
$(function() {
    $('#searchbar').focus();
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

var darkmodetoggle = localStorage.getItem('darkmode');
if (darkmodetoggle === "true") {
    darkMode();
}
