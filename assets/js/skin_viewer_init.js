// simple initializer script for the skin viewer
// copied blatantly (and modified) from https://github.com/bs-community/skinview3d

let skinViewer = new skinview3d.FXAASkinViewer(document.getElementById("skin_container"), {
    width: 250,
    height: 433,
    skin: null // show NO skin normally
});

// Control objects with your mouse!
let control = skinview3d.createOrbitControls(skinViewer);
control.enableRotate = true;
control.enableZoom = false;
control.enablePan = false;

// Add an animation
let walk = skinViewer.animations.add(skinview3d.WalkingAnimation);
// Add another animation
let rotate = skinViewer.animations.add(skinview3d.RotatingAnimation);
// Remove the rotating animation, and make the player face forward
rotate.resetAndRemove();

// Set the speed of an animation
walk.speed = 0.5;
// Pause single animation
walk.paused = false;


// Pause all animations!
skinViewer.animations.paused = false;
